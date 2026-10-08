import { createFileRoute, redirect } from '@tanstack/react-router';

import { isLoginProvider } from '@/features/auth-login';
import { OauthCallbackPage } from '@/pages/oauth-callback';

export const Route = createFileRoute('/login/oauth2/code/$provider')({
  // 경로 세그먼트는 검증되지 않은 문자열이다. 지원하지 않는 provider 면 요청 없이 돌려보낸다.
  beforeLoad: ({ params }) => {
    if (!isLoginProvider(params.provider)) {
      throw redirect({ to: '/', replace: true });
    }
  },
  component: OauthCallbackRoute,
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === 'string' ? search.code : undefined,
  }),
});

function OauthCallbackRoute() {
  const { provider } = Route.useParams();
  const { code } = Route.useSearch();

  // beforeLoad 가 이미 걸렀다. 타입을 좁히기 위한 가드다.
  if (!isLoginProvider(provider)) {
    return null;
  }

  return <OauthCallbackPage provider={provider} code={code} />;
}
