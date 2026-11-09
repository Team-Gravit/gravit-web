import { requestNative } from '@/shared/api';

import type { LoginProvider } from '../model/login-providers';

/** 사용자가 SDK 동의 화면에 머무는 시간의 상한. 취소는 네이티브가 즉시 알리므로 안전장치다. */
const NATIVE_LOGIN_TIMEOUT_MS = 120_000;

export type NativeLoginToken = Awaited<ReturnType<typeof requestNativeLogin>>;
export type NativePlatform = Awaited<ReturnType<typeof requestNativePlatform>>;

/** 네이티브 SDK로 로그인해 provider 토큰을 받는다. 백엔드 교환은 `exchangeNativeToken`이 한다. */
export function requestNativeLogin(provider: LoginProvider) {
  return requestNative('AUTH_LOGIN', { provider }, { timeoutMs: NATIVE_LOGIN_TIMEOUT_MS });
}

/**
 * 앱이 iOS인지 Android인지 네이티브에 묻는다.
 * iPad 웹뷰는 데스크톱 UA를 보낼 수 있어 `navigator.userAgent`로 판별하지 않는다.
 */
export async function requestNativePlatform() {
  const { platform } = await requestNative('APP_INFO', {});

  return platform;
}
