import { BridgeError } from '@/shared/api';
import {
  oauthLogin2 as androidIdTokenLogin,
  oauthNaverLogin1 as androidNaverLogin,
} from '@/shared/api/generated/oauth2-0-android-api/oauth2-0-android-api';
import type { LoginResponse } from '@/shared/api/generated/model';
import {
  appleLogin as iosAppleLogin,
  oauthLogin1 as iosIdTokenLogin,
  oauthNaverLogin as iosNaverLogin,
} from '@/shared/api/generated/oauth2-0-ios-api/oauth2-0-ios-api';

import type { LoginProvider } from '../model/login-providers';
import type { NativeLoginToken, NativePlatform } from './request-native-login';

// 생성 함수 이름의 번호는 OpenAPI operationId 충돌로 붙어 재생성 때마다 바뀔 수 있다.
// 이름이 아니라 파일(android · ios)로 골라 별칭을 붙이고, 이 파일 밖으로 노출하지 않는다.
const LOGIN_BY_PLATFORM = {
  android: { idToken: androidIdTokenLogin, naver: androidNaverLogin },
  ios: { idToken: iosIdTokenLogin, naver: iosNaverLogin },
} as const;

/**
 * SDK 토큰을 백엔드에서 서비스 세션 토큰으로 교환한다.
 *
 * 서버는 로그인한 경로로 리프레시 토큰의 기기 칸(ANDROID · IOS)을 정하므로 `platform`에 맞는 경로를 쓴다.
 * Google·Kakao는 `idToken`, Naver는 `accessToken`, Apple은 `authorizationCode`를 써서 요청
 * 경로가 다르다. 토큰 종류가 계약과 다르면 서버 요청 전에 `BridgeError('NATIVE_ERROR')`로 거절한다.
 *
 * Apple은 iOS 전용 엔드포인트다. 같은 이름의 웹용 생성 함수(`appleLogin1`)와 다르다.
 */
export function exchangeNativeToken(
  provider: LoginProvider,
  { tokenType, token }: NativeLoginToken,
  platform: NativePlatform,
): Promise<LoginResponse> {
  if (provider === 'apple') {
    if (tokenType !== 'authorizationCode') {
      return Promise.reject(
        new BridgeError('NATIVE_ERROR', `apple 은 authorizationCode 이어야 한다: ${tokenType}`),
      );
    }

    return iosAppleLogin({ code: token });
  }

  const login = LOGIN_BY_PLATFORM[platform];

  if (provider === 'naver') {
    if (tokenType !== 'accessToken') {
      return Promise.reject(
        new BridgeError('NATIVE_ERROR', `naver 는 accessToken 이어야 한다: ${tokenType}`),
      );
    }

    return login.naver({ accessToken: token });
  }

  if (tokenType !== 'idToken') {
    return Promise.reject(
      new BridgeError('NATIVE_ERROR', `${provider} 는 idToken 이어야 한다: ${tokenType}`),
    );
  }

  return login.idToken({ idToken: token }, { provider });
}
