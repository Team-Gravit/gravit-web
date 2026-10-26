import { Header } from '@/widgets/header';

import WithdrawFailedMascot from './assets/withdraw-failed-mascot.webp';
import { WithdrawStatusLayout } from './withdraw-status-layout';

/**
 * 탈퇴 인증 메일 발송 안내 화면. 설정에서 「계속하기」로 요청을 보낸 뒤 이 페이지로 이동한다.
 * (legacy `SuccessNotificationModal` 이전 — 모달에서 전체화면 페이지로 전환)
 * 마스코트는 탈퇴 실패 화면과 동일한 이미지를 쓴다.
 */
export function WithdrawEmailSentPage() {
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
