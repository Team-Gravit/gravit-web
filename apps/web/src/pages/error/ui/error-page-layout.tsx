import { Link, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { ErrorStatus, type ErrorStatusProps } from '@/shared/ui/error-status';
import { useAuthStore } from '@/entities/auth';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { NotificationPopover } from '@/widgets/notification';

const HOME_ROUTE = '/main';
const ACTION_CLASS = 'flex-1 md:h-12 md:w-auto md:flex-none md:px-10 md:text-body1-normal';

export type ErrorPageLayoutProps = Pick<ErrorStatusProps, 'code' | 'title' | 'descriptionLines'>;

export function ErrorPageLayout({ code, title, descriptionLines }: ErrorPageLayoutProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  // 헤더는 사용자 정보를 조회하므로 로그인한 사용자에게만 보인다.
  const hasSession = useAuthStore((state) => state.accessToken !== null);

  const handleBackClick = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }

    void navigate({ to: HOME_ROUTE, replace: true });
  };

  return (
    <div data-slot="error-page" className="flex min-h-dvh flex-col bg-bg-0 md:bg-bg-2">
      {hasSession ? (
        <div className="hidden md:block">
          <Header notificationSlot={<NotificationPopover />} />
        </div>
      ) : null}
      {/* 안내와 버튼을 첫 화면에 두고, 푸터는 아래로 스크롤하면 보이도록 한다. */}
      <main className="flex flex-1 flex-col md:min-h-dvh md:items-center md:justify-center md:pt-(--desktop-header-height)">
        <ErrorStatus
          code={code}
          title={title}
          descriptionLines={descriptionLines}
          actions={
            <>
              <Button
                type="button"
                variant="stroke-neutral"
                size="cta"
                className={ACTION_CLASS}
                onClick={handleBackClick}
              >
                돌아가기
              </Button>
              <Button asChild size="cta" className={ACTION_CLASS}>
                <Link to={HOME_ROUTE}>메인으로</Link>
              </Button>
            </>
          }
        />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
