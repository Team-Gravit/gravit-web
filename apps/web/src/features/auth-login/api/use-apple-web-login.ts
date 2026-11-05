import { useMutation } from '@tanstack/react-query';

import { setSession } from '@/entities/auth';
import { appleLogin1 } from '@/shared/api/generated/oauth2-0-api/oauth2-0-api';
import { getOauthDest } from '@/shared/config';

import { requestAppleWebCode } from './request-apple-web-login';

/**
 * 브라우저에서 Apple 팝업으로 받은 코드를 백엔드 세션으로 교환하고 저장한다.
 * 이동은 호출부가 `isOnboarded`를 보고 결정한다.
 */
export function useAppleWebLogin() {
  return useMutation({
    mutationFn: async () => {
      const code = await requestAppleWebCode();

      return appleLogin1({ code }, { dest: getOauthDest() });
    },
    // 인가 코드는 일회용이라 재시도하면 두 번째 교환이 실패한다.
    retry: false,
    onSuccess: ({ accessToken, refreshToken }) => {
      setSession({ accessToken, refreshToken });
    },
  });
}
