import { createFileRoute, useLocation, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

import { usePostOAuth } from '@/entities/login/model/usePostOAuth';

export const Route = createFileRoute('/login/oauth2/code/$provider')({
  component: OAuthCallback,
});

function OAuthCallback() {
  const params = useParams({ from: Route.id });
  const provider = params.provider as string;
  const location = useLocation();
  const postOAuth = usePostOAuth();

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  useEffect(() => {
    if (provider && code) {
      const dest =
        import.meta.env.MODE === 'development' ? 'local' : import.meta.env.VITE_OAUTH_DEST;

      postOAuth.mutate({ provider, dest, code });
    }
    // OAuth 콜백은 마운트 시 1회만 실행되어야 함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return;
}
