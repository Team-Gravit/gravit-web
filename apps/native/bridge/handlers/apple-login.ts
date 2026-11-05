import type { BridgeResult } from '@repo/bridge-protocol';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { BridgeHandlerError } from '../bridge-handler-error';

// 사용자가 Apple 로그인 시트를 닫았을 때 expo-apple-authentication 이 reject 하는 코드.
const APPLE_CANCEL_ERROR_CODE = 'ERR_REQUEST_CANCELED';

function readAppleErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error as { code?: unknown };

    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}

/**
 * 네이티브 Apple 로그인 시트로 `authorizationCode` 를 받아 돌려준다.
 *
 * 서버가 코드만 받고 Apple 과의 토큰 교환을 맡는다. 서버는 이름을 쓰지 않으므로 이메일 범위만
 * 요청한다. Android 에는 Apple SDK 가 없어 지원하지 않는다 (`UNSUPPORTED`).
 * 코드 값은 어디에도 로그하지 않는다.
 */
export async function loginWithApple(): Promise<BridgeResult<'AUTH_LOGIN'>> {
  if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) {
    throw new BridgeHandlerError('UNSUPPORTED');
  }

  let credential: Awaited<ReturnType<typeof AppleAuthentication.signInAsync>>;

  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
  } catch (error) {
    const code = readAppleErrorCode(error);

    if (code === APPLE_CANCEL_ERROR_CODE) {
      throw new BridgeHandlerError('CANCELLED');
    }

    const message = error instanceof Error ? error.message : String(error);

    throw new BridgeHandlerError('NATIVE_ERROR', `${code ?? 'AppleUnknown'}: ${message}`);
  }

  if (!credential.authorizationCode) {
    throw new BridgeHandlerError('NATIVE_ERROR', 'AppleAuthorizationCodeMissing');
  }

  return { tokenType: 'authorizationCode', token: credential.authorizationCode };
}
