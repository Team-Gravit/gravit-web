import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { toast } from '@/shared/ui/toast';
import {
  LOGIN_FAILED_MESSAGE,
  consumePendingOauthState,
  readWithdrawnProviderId,
  resolveLoginDestination,
  useOauthCallback,
  type LoginProvider,
} from '@/features/auth-login';

export interface OauthCallbackPageProps {
  provider: LoginProvider;
  code: string | undefined;
  state: string | undefined;
}

/**
 * provider가 돌려보낸 인가 코드를 토큰으로 바꾸고 다음 화면을 정한다.
 *
 * 화면에 그릴 것이 없다. **어떤 결과든 반드시 다른 경로로 이동한다** — 여기 남으면 사용자는
 * 빈 화면에 갇히고, 뒤로 가기를 눌러도 인가 코드가 이미 소모돼 복구할 수 없다.
 * 코드가 1회용이므로 이동은 replace로 해서 뒤로 가기가 이 경로로 돌아오지 않게 한다. (기준선 D5)
 */
export function OauthCallbackPage({ provider, code, state }: OauthCallbackPageProps) {
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

    // 이 브라우저가 시작한 로그인이 아니면 교환하지 않는다. 남이 보낸 콜백 링크로 그 사람 계정에
    // 로그인되는 것을 막는다. (FEAT-080 AC-3) state 가 없으면 앞의 확인이 이미 거절한다. 뒤는 타입을 좁힌다.
    if (!consumePendingOauthState({ provider, state }) || !state) {
      toast(LOGIN_FAILED_MESSAGE, { position: 'noneTabBottom' });
      navigate({ to: '/', replace: true });
      return;
    }

    mutate(
      { provider, code, state },
      {
        onSuccess: (response) => {
          navigate({ to: resolveLoginDestination(response), replace: true });
        },
        onError: (error) => {
          const providerId = readWithdrawnProviderId(error);

          if (providerId) {
            navigate({ to: '/restore', search: { providerId }, replace: true });
            return;
          }

          toast(LOGIN_FAILED_MESSAGE, { position: 'noneTabBottom' });
          navigate({ to: '/', replace: true });
        },
      },
    );
  }, [code, mutate, navigate, provider, state]);

  return null;
}
