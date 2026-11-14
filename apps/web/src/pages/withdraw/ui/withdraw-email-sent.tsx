import { useState } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';
import { useLogout } from '@/features/auth-logout';
import { useWithdrawalCompletion, type WithdrawalCheckResult } from '@/features/user-withdraw';
import { Header } from '@/widgets/header';

import WithdrawFailedMascot from './assets/withdraw-failed-mascot.webp';
import { WithdrawResult } from './withdraw-result';
import { WithdrawStatusLayout } from './withdraw-status-layout';

/** 직접 확인했는데 결과가 탈퇴 완료가 아닐 때 보여 줄 안내. 탈퇴 완료면 화면이 바뀌어 안내가 없다. */
const CHECK_RESULT_MESSAGES: Partial<Record<WithdrawalCheckResult, string>> = {
  active: '아직 탈퇴가 확정되지 않았어요. 메일의 「탈퇴 확정하기」를 눌러 주세요.',
  unknown: '탈퇴 여부를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.',
};

/**
 * 탈퇴 인증 메일 발송 안내 화면. 설정에서 「계속하기」로 요청을 보낸 뒤 이 페이지로 이동한다.
 * (legacy `SuccessNotificationModal` 이전 — 모달에서 전체화면 페이지로 전환)
 * 마스코트는 탈퇴 실패 화면과 동일한 이미지를 쓴다.
 *
 * 메일 링크는 메일 앱의 별도 브라우저에서 열려 확정 결과가 이 화면에 전해지지 않는다.
 * 화면으로 돌아올 때 확정 여부를 확인해, 확정됐으면 세션을 끝내고 탈퇴 완료 화면을 보여 준다.
 * 복귀 신호를 놓쳐도 갇히지 않도록 「탈퇴를 확정했어요」로 직접 확인할 수 있다.
 */
export function WithdrawEmailSentPage() {
  const [isWithdrawn, setIsWithdrawn] = useState(false);
  const logout = useLogout({ onSuccess: () => setIsWithdrawn(true) });

  const { checkNow, isChecking } = useWithdrawalCompletion({ onWithdrawn: logout });

  const handleCheckClick = async () => {
    const result = await checkNow();
    const message = CHECK_RESULT_MESSAGES[result];

    if (message) {
      toast(message, { position: 'noneTabBottom' });
    }
  };

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
        action={
          <Button size="cta" disabled={isChecking} onClick={handleCheckClick}>
            탈퇴를 확정했어요
          </Button>
        }
      />
    </>
  );
}
