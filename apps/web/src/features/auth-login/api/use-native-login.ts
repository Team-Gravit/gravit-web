import { useMutation } from '@tanstack/react-query';

import { setSession } from '@/entities/auth';

import type { LoginProvider } from '../model/login-providers';
import { exchangeNativeToken } from './exchange-native-token';
import { requestNativeLogin, requestNativePlatform } from './request-native-login';

/**
 * 앱에서 SDK 토큰을 받아 백엔드 세션으로 교환하고 저장한다.
 * 기기 종류를 먼저 확인해, 확인이 실패하면 SDK 화면을 띄우지 않는다.
 * 브릿지와 백엔드 오류는 호출부에 전달한다. 이동은 호출부가 `isOnboarded`를 보고 결정한다.
 */
export function useNativeLogin() {
  return useMutation({
    mutationFn: async (provider: LoginProvider) => {
      const platform = await requestNativePlatform();
      const token = await requestNativeLogin(provider);

      return exchangeNativeToken(provider, token, platform);
    },
    // SDK 토큰은 1회용에 가깝고, 재시도하면 SDK 화면이 다시 뜬다.
    retry: false,
    onSuccess: ({ accessToken, refreshToken }) => {
      setSession({ accessToken, refreshToken });
    },
  });
}
