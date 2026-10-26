import { createFileRoute } from '@tanstack/react-router';

import { RestorePage } from '@/pages/restore';

// 공개 라우트: soft-delete 계정이 OAuth 로그인 시 USER_423 으로 복구 흐름에 들어온다.
// providerId 는 oauth-callback 이 에러 message 에서 읽어 넘긴다.
export const Route = createFileRoute('/restore')({
  component: RestoreRoute,
  validateSearch: (search: Record<string, unknown>): { providerId: string } => ({
    providerId: typeof search.providerId === 'string' ? search.providerId : '',
  }),
});

function RestoreRoute() {
  const { providerId } = Route.useSearch();

  return <RestorePage providerId={providerId} />;
}
