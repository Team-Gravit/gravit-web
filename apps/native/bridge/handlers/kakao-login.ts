import { login } from '@react-native-kakao/user';
import type { BridgeResult } from '@repo/bridge-protocol';

import { BridgeHandlerError } from '../bridge-handler-error';

/**
 * 사용자 취소로 볼 Kakao SDK 에러 코드. `@react-native-kakao` 는 iOS · Android SDK 의 에러 이름을
 * `code` 로 그대로 넘긴다 — 카카오톡에서 뒤로 가기는 `Cancelled`, 계정 로그인 시트에서 동의 거부는
 * `AccessDenied`. 실기기 검증에서 다른 코드가 관찰되면 여기에 더한다.
 */
const KAKAO_CANCEL_ERROR_CODES = ['Cancelled', 'AccessDenied'];

function readKakaoErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error as { code?: unknown };

    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}

/**
 * 카카오 SDK 로 로그인해 OIDC `idToken` 을 돌려준다. 카카오톡이 있으면 앱으로 전환하고, 없으면
 * SDK 가 계정 로그인 시트로 폴백한다.
 *
 * `idToken` 은 Kakao Developers 에서 OpenID Connect 를 켠 앱에만 온다. 없으면 설정 문제이므로
 * `NATIVE_ERROR` 에 그 힌트를 싣는다. 토큰 값은 어디에도 로그하지 않는다.
 */
export async function loginWithKakao(): Promise<BridgeResult<'AUTH_LOGIN'>> {
  let token: Awaited<ReturnType<typeof login>>;

  try {
    token = await login();
  } catch (error) {
    const code = readKakaoErrorCode(error);

    if (code && KAKAO_CANCEL_ERROR_CODES.includes(code)) {
      throw new BridgeHandlerError('CANCELLED');
    }

    const message = error instanceof Error ? error.message : String(error);

    throw new BridgeHandlerError('NATIVE_ERROR', `${code ?? 'KakaoUnknown'}: ${message}`);
  }

  if (!token.idToken) {
    throw new BridgeHandlerError(
      'NATIVE_ERROR',
      'KakaoIdTokenMissing: 콘솔에서 OpenID Connect 가 활성화돼 있는지 확인한다',
    );
  }

  return { tokenType: 'idToken', token: token.idToken };
}
