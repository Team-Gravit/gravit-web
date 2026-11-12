import { GoogleSignin } from '@react-native-google-signin/google-signin';
import type { BridgeResult } from '@repo/bridge-protocol';
import Constants from 'expo-constants';

import { BridgeHandlerError } from '../bridge-handler-error';

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function toNativeError(error: unknown): BridgeHandlerError {
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'Unknown';
  const message = error instanceof Error ? error.message : String(error);

  return new BridgeHandlerError('NATIVE_ERROR', `Google ${code}: ${message}`);
}

/**
 * Google SDK 로 로그인해 `idToken` 을 돌려준다.
 *
 * `webClientId` 가 서버가 검증하는 `aud` 다. 무료 "Original" API 만 쓴다 — universal 모듈은 유료다.
 * 토큰 값은 어디에도 로그하지 않는다.
 */
export async function loginWithGoogle(): Promise<BridgeResult<'AUTH_LOGIN'>> {
  const extra = Constants.expoConfig?.extra;
  const webClientId = readString(extra?.googleWebClientId);
  const iosClientId = readString(extra?.googleIosClientId);

  if (!webClientId) {
    throw new BridgeHandlerError('NATIVE_ERROR', 'GoogleConfigMissing: 앱 설정을 확인한다');
  }

  let response: Awaited<ReturnType<typeof GoogleSignin.signIn>>;

  try {
    GoogleSignin.configure({ webClientId, iosClientId });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    response = await GoogleSignin.signIn();
  } catch (error) {
    throw toNativeError(error);
  }

  if (response.type === 'cancelled') {
    throw new BridgeHandlerError('CANCELLED');
  }

  if (!response.data.idToken) {
    throw new BridgeHandlerError('NATIVE_ERROR', 'GoogleIdTokenMissing: webClientId 를 확인한다');
  }

  return { tokenType: 'idToken', token: response.data.idToken };
}
