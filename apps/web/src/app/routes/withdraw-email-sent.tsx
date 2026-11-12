import { createFileRoute } from '@tanstack/react-router';

import { WithdrawEmailSentPage } from '@/pages/withdraw';

// 공개 전체화면 안내. 설정에서 탈퇴 인증 메일 요청 후 이동한다. 셸(헤더·탭)은 쓰지 않는다.
export const Route = createFileRoute('/withdraw-email-sent')({
  component: WithdrawEmailSentPage,
});
