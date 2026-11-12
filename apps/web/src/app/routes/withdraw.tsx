import { createFileRoute } from '@tanstack/react-router';

import { AccountDeletionPage } from '@/pages/withdraw';

// 공개 라우트: confirm 은 JWT 불필요 + 메일 링크(비로그인 브라우저)로 진입하므로 _authenticated 밖에 둔다.
// 경로는 백엔드가 만드는 confirm 메일 링크 path 와 일치해야 한다. 현재는 테스트를 위해 legacy 경로
// '/user/me/delete' 를 사용하며, 추후 '/withdraw' 로 변경 예정이다. (변경 시 백엔드 링크도 함께 조정)
export const Route = createFileRoute('/withdraw')({
  component: WithdrawRoute,
  validateSearch: (search: Record<string, unknown>): { mailAuthCode: string } => ({
    mailAuthCode: typeof search.mailAuthCode === 'string' ? search.mailAuthCode : '',
  }),
});

function WithdrawRoute() {
  const { mailAuthCode } = Route.useSearch();
  return <AccountDeletionPage mailAuthCode={mailAuthCode} />;
}
