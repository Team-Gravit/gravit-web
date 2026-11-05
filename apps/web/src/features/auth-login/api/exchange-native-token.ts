import { BridgeError } from '@/shared/api';
import {
  oauthLogin1,
  oauthNaverLogin,
} from '@/shared/api/generated/oauth2-0-android-api/oauth2-0-android-api';
import type { LoginResponse } from '@/shared/api/generated/model';

import type { LoginProvider } from '../model/login-providers';
import type { NativeLoginToken } from './request-native-login';

/**
 * SDK 토큰을 백엔드에서 서비스 세션 토큰으로 교환한다.
 *
 * Google·Kakao는 `idToken`, Naver는 `accessToken`을 써서 요청 경로가 다르다.
 * 토큰 종류가 계약과 다르면 서버 요청 전에 `BridgeError('NATIVE_ERROR')`로 거절한다.
 *
 * `android`라는 API 이름과 달리 iOS도 같은 엔드포인트를 쓴다. 생성 함수 `oauthLogin1`은
 * OpenAPI operationId 충돌로 붙은 이름이라 이 파일 밖으로 노출하지 않는다.
 */
export function exchangeNativeToken(
  provider: LoginProvider,
  { tokenType, token }: NativeLoginToken,
): Promise<LoginResponse> {
  if (provider === 'naver') {
    if (tokenType !== 'accessToken') {
      return Promise.reject(
        new BridgeError('NATIVE_ERROR', `naver 는 accessToken 이어야 한다: ${tokenType}`),
      );
    }

    return oauthNaverLogin({ accessToken: token });
  }

  if (tokenType !== 'idToken') {
    return Promise.reject(
      new BridgeError('NATIVE_ERROR', `${provider} 는 idToken 이어야 한다: ${tokenType}`),
    );
  }

  return oauthLogin1({ idToken: token }, { provider });
}
