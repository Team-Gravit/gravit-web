import { requestNative } from '@/shared/api';

import type { LoginProvider } from '../model/login-providers';

/** 사용자가 SDK 동의 화면에 머무는 시간의 상한. 취소는 네이티브가 즉시 알리므로 안전장치다. */
const NATIVE_LOGIN_TIMEOUT_MS = 120_000;

export type NativeLoginToken = Awaited<ReturnType<typeof requestNativeLogin>>;

/** 네이티브 SDK로 로그인해 provider 토큰을 받는다. 백엔드 교환은 `exchangeNativeToken`이 한다. */
export function requestNativeLogin(provider: LoginProvider) {
  return requestNative('AUTH_LOGIN', { provider }, { timeoutMs: NATIVE_LOGIN_TIMEOUT_MS });
}
