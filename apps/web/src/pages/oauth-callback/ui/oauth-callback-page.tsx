import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';

import { useOauthCallback, type LoginProvider } from '@/features/auth-login';

/** 탈퇴한 계정이면 서버가 이 코드로 복구 흐름을 요구한다. message에 providerId가 담긴다. (기준선 D6) */
const WITHDRAWN_ACCOUNT_ERROR = 'USER_423';

export interface OauthCallbackPageProps {
  provider: LoginProvider;
  code: string | undefined;
}

/** 탈퇴 계정 응답이면 복구에 쓸 providerId를, 아니면 `null`을 반환한다. */
function readWithdrawnProviderId(error: unknown): string | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const body = error.response?.data as { error?: string; message?: unknown } | undefined;

  if (body?.error !== WITHDRAWN_ACCOUNT_ERROR || typeof body.message !== 'string') {
    return null;
  }

  return body.message;
}

/**
 * provider가 돌려보낸 인가 코드를 토큰으로 바꾸고 다음 화면을 정한다.
 *
 * 화면에 그릴 것이 없다. **어떤 결과든 반드시 다른 경로로 이동한다** — 여기 남으면 사용자는
 * 빈 화면에 갇히고, 뒤로 가기를 눌러도 인가 코드가 이미 소모돼 복구할 수 없다.
 * 코드가 1회용이므로 이동은 replace로 해서 뒤로 가기가 이 경로로 돌아오지 않게 한다. (기준선 D5)
 */
export function OauthCallbackPage({ provider, code }: OauthCallbackPageProps) {
  const navigate = useNavigate();
  const { mutate } = useOauthCallback();
  // 인가 코드는 1회용이다. StrictMode의 이중 렌더에서도 교환이 두 번 나가면 안 된다. (기준선 D3)
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) {
      return;
    }

    hasExchanged.current = true;

    // 사용자가 동의를 거부하면 provider 는 code 없이 돌려보낸다. 잘못된 직접 진입도 같다.
    if (!code) {
      navigate({ to: '/', replace: true });
      return;
    }

    mutate(
      { provider, code },
      {
        onSuccess: ({ isOnboarded }) => {
          navigate({ to: isOnboarded ? '/main' : '/onboarding', replace: true });
        },
        onError: (error) => {
          const providerId = readWithdrawnProviderId(error);

          if (providerId) {
            navigate({ to: '/restore', search: { providerId }, replace: true });
            return;
          }

          // 실패 사유 표시는 별도 작업(FEAT-017)이다. 지금은 최소한 로그인 화면으로 되돌린다.
          navigate({ to: '/', replace: true });
        },
      },
    );
  }, [code, mutate, navigate, provider]);

  return null;
}
