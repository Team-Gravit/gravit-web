import { useRouter } from '@tanstack/react-router';

import NotAuthenticatedMascot from '@/shared/assets/_images/not-authenticated-mascot.png';
import { Button } from '@/shared/ui/button/Button';
import { LinkButton } from '@/shared/ui/button/link-button';

import ErrorPageTemplate from './status-page-layout';

export default function NotAuthenticatedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <ErrorPageTemplate
      icon={
        <img
          src={NotAuthenticatedMascot}
          alt="접근 권한이 없어요"
          className="size-[175px] md:size-auto"
        />
      }
      title="접근 권한이 없어요."
      description={
        <>
          이 페이지는 로그인한 사용자만 이용 할 수 있어요.
          <br />
          계속하시려면 로그인 후 다시 시도해 주세요.
        </>
      }
    >
      <Button
        className="text-main-1 flex-1 h-12 bg-white md:h-[54px] md:text-headline2"
        variant={'strokeGray'}
        type="button"
        onClick={handleGoBack}
      >
        돌아가기
      </Button>

      <LinkButton to="/main" className="block flex-1 h-12 md:h-[54px] md:text-headline2">
        메인으로
      </LinkButton>
    </ErrorPageTemplate>
  );
}
