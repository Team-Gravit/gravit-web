import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { getSessionToken } from '@/entities/auth';
import { useLogout } from '@/features/auth-logout';
import { useConfirmWithdrawal } from '@/features/user-withdraw';

import { Footer } from '@/widgets/footer';
import { Button } from '@/shared/ui/button';

import withdrawMascot from './assets/withdraw-failed-mascot.webp';
import { WithdrawResult } from './withdraw-result';

interface AccountDeletionPageProps {
  /** 메일 링크로 전달된 삭제 인증 코드. */
  mailAuthCode: string;
}

/**
 * 탈퇴 확정 화면. 메일 링크로 진입한다. (legacy `user.me.delete.page` 이전 — UI 그대로)
 * confirm 은 JWT 불필요라 공개 라우트에 두며 인증 상태를 가정하지 않는다.
 */
export function AccountDeletionPage({ mailAuthCode }: AccountDeletionPageProps) {
  const navigate = useNavigate();
  const logout = useLogout({ onSuccess: () => navigate({ to: '/' }) });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { confirmWithdrawal, isPending, isSuccess, isError } = useConfirmWithdrawal({
    // 로그인 상태(토큰 보유)에서 확정했다면 세션을 끝내고 로그인 화면으로 보낸다.
    // 메일 링크를 비로그인 브라우저에서 열었다면 토큰이 없어 결과 화면을 그대로 보여준다.
    onSuccess: () => {
      if (getSessionToken()) {
        logout();
      }
    },
  });

  const handleConfirmWithdraw = () => {
    if (isConfirmed) return;

    setIsConfirmed(true);
    confirmWithdrawal(mailAuthCode);
  };

  // 확정 성공 → 결과 화면. (로그인 상태였다면 onSuccess 에서 이미 '/'로 이동한다)
  if (isSuccess) {
    return <WithdrawResult status="success" />;
  }

  // 확정 실패 → 결과 화면
  if (isError) {
    return <WithdrawResult status="failed" />;
  }

  // 확인 페이지
  return (
    <>
      <main className="bg-bg-0 md:bg-bg-2 flex min-h-screen flex-col items-center justify-between text-center px-4 py-5 md:p-0">
        <section className="flex-1 flex items-center justify-between md:justify-center flex-col w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center justify-center flex-col md:mb-8">
            <img className="w-36.5 md:w-50 mx-auto" src={withdrawMascot} alt="" />
            <h1 className="text-heading1 md:text-title3 text-text-1 mt-10 md:mt-8 mb-2 md:mb-3">
              정말 탈퇴하실건가요?
            </h1>
            <p className="text-body2-normal md:text-headline1 text-text-4">
              클릭 시 즉시 확정되며,
              <br />
              관련 데이터는 정책에 따라 순차 삭제됩니다.
            </p>
          </div>

          <Button
            type="button"
            size="cta"
            onClick={handleConfirmWithdraw}
            disabled={isPending}
            className="bg-error hover:bg-semantic-error active:bg-error-info"
          >
            {isPending ? '탈퇴 처리 중...' : '탈퇴 확정하기'}
          </Button>
        </section>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}
