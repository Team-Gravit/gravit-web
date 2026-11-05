import NaverLogin from '@react-native-seoul/naver-login';
import type { BridgeResult } from '@repo/bridge-protocol';
import Constants from 'expo-constants';

import { BridgeHandlerError } from '../bridge-handler-error';

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

/**
 * 네이버 SDK 로 로그인해 `accessToken` 을 돌려준다. 네이버는 `idToken` 이 없다.
 *
 * SDK 는 실패도 reject 하지 않고 `isSuccess: false` 로 돌려주며, 취소 여부는 `isCancel` 로 알려 준다.
 * 토큰 값은 어디에도 로그하지 않는다.
 */
export async function loginWithNaver(): Promise<BridgeResult<'AUTH_LOGIN'>> {
  const extra = Constants.expoConfig?.extra;
  const consumerKey = readString(extra?.naverClientId);
  const consumerSecret = readString(extra?.naverClientSecret);
  const appName = readString(extra?.naverAppName);
  const serviceUrlSchemeIOS = readString(extra?.naverUrlScheme);

  if (!consumerKey || !consumerSecret || !appName || !serviceUrlSchemeIOS) {
    throw new BridgeHandlerError('NATIVE_ERROR', 'NaverConfigMissing: 앱 설정을 확인한다');
  }

  let response: Awaited<ReturnType<typeof NaverLogin.login>>;

  try {
    NaverLogin.initialize({ consumerKey, consumerSecret, appName, serviceUrlSchemeIOS });
    response = await NaverLogin.login();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new BridgeHandlerError('NATIVE_ERROR', `Naver: ${message}`);
  }

  if (response.isSuccess && response.successResponse) {
    return { tokenType: 'accessToken', token: response.successResponse.accessToken };
  }

  if (response.failureResponse?.isCancel) {
    throw new BridgeHandlerError('CANCELLED');
  }

  throw new BridgeHandlerError(
    'NATIVE_ERROR',
    `Naver: ${response.failureResponse?.message ?? '로그인 실패'}`,
  );
}
