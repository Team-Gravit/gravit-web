import { useMutation } from '@tanstack/react-query';

import { setWebSession } from '@/entities/auth';
import { appleLogin1 as appleWebLogin } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { getOauthDest } from '@/shared/config';

import { getLoginUrl } from './get-login-url';
import { requestAppleWebCode } from './request-apple-web-login';

/**
 * 브라우저에서 Apple 팝업으로 받은 코드를 백엔드 세션으로 교환하고 저장한다.
 * 이동은 호출부가 `isOnboarded`를 보고 결정한다.
 *
 * 팝업은 리다이렉트가 없어 `state`를 저장하지 않는다. 받은 값을 SDK에 넣고 응답과 바로 비교한다.
 */
export function useAppleWebLogin() {
  return useMutation({
    mutationFn: async () => {
      const { state } = await getLoginUrl('apple');
      const code = await requestAppleWebCode(state);

      return appleWebLogin({ code, state }, { dest: getOauthDest() });
    },
    // 인가 코드는 일회용이라 재시도하면 두 번째 교환이 실패한다.
    retry: false,
    onSuccess: ({ accessToken }) => {
      setWebSession(accessToken);
    },
  });
}
