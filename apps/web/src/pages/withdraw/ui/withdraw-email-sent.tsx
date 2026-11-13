import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { useLogout } from '@/features/auth-logout';
import { useWithdrawalCompletion } from '@/features/user-withdraw';
import { Header } from '@/widgets/header';

import WithdrawFailedMascot from './assets/withdraw-failed-mascot.webp';
import { WithdrawResult } from './withdraw-result';
import { WithdrawStatusLayout } from './withdraw-status-layout';

/**
 * 탈퇴 인증 메일 발송 안내 화면. 설정에서 「계속하기」로 요청을 보낸 뒤 이 페이지로 이동한다.
 * (legacy `SuccessNotificationModal` 이전 — 모달에서 전체화면 페이지로 전환)
 * 마스코트는 탈퇴 실패 화면과 동일한 이미지를 쓴다.
 *
 * 메일 링크는 메일 앱의 별도 브라우저에서 열려 확정 결과가 이 화면에 전해지지 않는다.
 * 화면으로 돌아올 때 확정 여부를 확인해, 확정됐으면 세션을 끝내고 탈퇴 완료 화면을 보여 준다.
 */
export function WithdrawEmailSentPage() {
  const [isWithdrawn, setIsWithdrawn] = useState(false);
  const logout = useLogout({ onSuccess: () => setIsWithdrawn(true) });

  useWithdrawalCompletion({ onWithdrawn: logout });

  if (isWithdrawn) {
    return (
      <WithdrawResult
        status="success"
        action={
          <Button asChild size="cta">
            <Link to="/">확인</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      {/* 데스크톱에서만 헤더를 노출한다. 보이기/숨기기 수준이라 CSS 로 처리한다. */}
      <div className="hidden md:block">
        <Header />
      </div>
      <WithdrawStatusLayout
        mascotSrc={WithdrawFailedMascot}
        title="메일을 보냈어요."
        description={
          <>
            가입하신 이메일로 메일을 전송해드렸으니
            <br />
            다시 메일을 확인해주시고
            <br />
            절차를 따라주세요.
          </>
        }
      />
    </>
  );
}
