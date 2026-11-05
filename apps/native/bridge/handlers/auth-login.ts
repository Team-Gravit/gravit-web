import type { BridgeHandlers } from '../create-bridge';
import { loginWithGoogle } from './google-login';
import { loginWithKakao } from './kakao-login';
import { loginWithNaver } from './naver-login';

/** 네이티브 SDK 소셜 로그인. provider 별 SDK 호출로 갈라지고, 결과 토큰의 백엔드 교환은 웹이 한다. */
export const handleAuthLogin: BridgeHandlers['AUTH_LOGIN'] = ({ provider }) => {
  switch (provider) {
    case 'kakao':
      return loginWithKakao();
    case 'google':
      return loginWithGoogle();
    case 'naver':
      return loginWithNaver();
  }
};
