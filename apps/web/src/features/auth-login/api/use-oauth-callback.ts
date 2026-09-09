import { useCallback } from 'react';

import { setSession } from '@/entities/auth';
import { useOauthLogin } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { getOauthDest } from '@/shared/config';

import type { LoginProvider } from '../model/login-providers';

interface OauthCallbackVariables {
  provider: LoginProvider;
  code: string;
}

/**
 * 인가 코드를 토큰으로 교환하고 세션을 만든다. (기준선 D4)
 *
 * 이동 목적지는 정하지 않는다. 응답의 `isOnboarded`를 호출부가 보고 결정한다.
 * `dest`는 전송 계층의 사정이라 호출부에 드러내지 않는다.
 */
export function useOauthCallback() {
  const { mutate, ...rest } = useOauthLogin({
    mutation: {
      // 인가 코드의 중복 교환을 피하기 위해 자동 재시도를 끈다
      retry: false,
      onSuccess: ({ accessToken, refreshToken }) => {
        setSession({ accessToken, refreshToken });
      },
    },
  });

  const exchangeCode = useCallback(
    ({ provider, code }: OauthCallbackVariables, options?: Parameters<typeof mutate>[1]) =>
      mutate({ provider, data: { code }, params: { dest: getOauthDest() } }, options),
    [mutate],
  );

  return { ...rest, mutate: exchangeCode };
}
