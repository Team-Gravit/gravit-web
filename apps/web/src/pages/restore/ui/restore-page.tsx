import { useNavigate } from '@tanstack/react-router';

import { useRestoreAccount } from '@/features/user-restore';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';
import { Footer } from '@/widgets/footer';

import RestoreMascot from './assets/restore-mascot.webp';

interface RestorePageProps {
  providerId: string;
}

export function RestorePage({ providerId }: RestorePageProps) {
  const navigate = useNavigate();
  const { restoreAccount, isPending } = useRestoreAccount({
    onSuccess: () => navigate({ to: '/' }),
    onError: (message) => toast(message),
  });

  const handleCancelRestore = () => {
    navigate({ to: '/' });
  };

  const handleRestoreUser = () => {
    restoreAccount(providerId);
  };

  return (
    <>
      <main className="bg-bg-0 md:bg-bg-2 flex min-h-screen flex-col items-center justify-between text-center px-4 pt-5 pb-safe-5 md:p-0">
        <section className="w-full md:max-w-[370px] flex-1 flex flex-col items-center justify-between md:justify-center gap-8">
          <div className="flex flex-col items-center justify-center md:my-10 flex-1 md:flex-none gap-10 md:gap-8">
            <img src={RestoreMascot} alt="" className="w-36.5 md:w-50 mx-auto" />
            <h1 className="text-heading1 md:text-title3 text-text-1">돌아오신 것을 환영해요!</h1>
          </div>
          <div className="flex w-full gap-3 md:gap-4">
            {/* 취소 버튼은 secondary 를 기반으로 배경(bg-0)·텍스트(main)만 시안 값으로 맞춘다. */}
            <Button
              variant="stroke-secondary"
              size="cta"
              className="flex-1 bg-bg-0 text-main"
              onClick={handleCancelRestore}
              disabled={isPending}
            >
              취소하기
            </Button>
            <Button
              variant="default"
              size="cta"
              className="flex-1"
              onClick={handleRestoreUser}
              isLoading={isPending}
            >
              복구하기
            </Button>
          </div>
        </section>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
