import { BridgeError } from '@/shared/api';
import { getAppleClientId } from '@/shared/config';

// 버튼은 직접 그리므로 SDK 의 로케일은 화면에 영향이 없다.
const APPLE_SDK_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

// 사용자가 팝업을 닫았을 때 SDK 가 reject 하는 `error` 값.
const APPLE_CANCEL_ERRORS = ['popup_closed_by_user', 'user_cancelled_authorize'];

interface AppleSignInResponse {
  authorization?: { code?: string; state?: string };
}

interface AppleIdAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    state: string;
    usePopup: boolean;
  }) => void;
  signIn: () => Promise<AppleSignInResponse>;
}

declare global {
  interface Window {
    AppleID?: { auth: AppleIdAuth };
  }
}

let sdkLoading: Promise<AppleIdAuth> | null = null;

function loadAppleSdk(): Promise<AppleIdAuth> {
  if (window.AppleID) {
    return Promise.resolve(window.AppleID.auth);
  }

  sdkLoading ??= new Promise<AppleIdAuth>((resolve, reject) => {
    const script = document.createElement('script');

    script.src = APPLE_SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.AppleID) {
        resolve(window.AppleID.auth);
        return;
      }

      sdkLoading = null;
      reject(new Error('Apple 로그인 SDK 를 초기화하지 못했다'));
    };
    script.onerror = () => {
      // 다음 클릭에서 다시 시도할 수 있게 실패한 로딩은 기억하지 않는다.
      sdkLoading = null;
      script.remove();
      reject(new Error('Apple 로그인 SDK 를 불러오지 못했다'));
    };
    document.head.appendChild(script);
  });

  return sdkLoading;
}

function readAppleErrorName(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const { error: name } = error as { error?: unknown };

    return typeof name === 'string' ? name : undefined;
  }

  return undefined;
}

/**
 * Apple JS SDK 팝업으로 로그인해 `authorizationCode` 를 받는다. 서버 교환은 호출부가 한다.
 *
 * `state` 는 서버가 `login-url/apple` 로 발급한 값이다. 팝업 응답의 `state` 가 다르면 이 브라우저가
 * 시작한 로그인이 아니므로 실패한다. (FEAT-080 AC-6)
 *
 * 팝업을 닫으면 `BridgeError('CANCELLED')` 로 실패해 앱 경로와 같은 취소 처리를 쓴다.
 * `redirectURI` 는 서버가 Apple 에 보내는 값과 같아야 하고, Apple 콘솔의 Services ID 에 등록돼 있어야 한다.
 */
export async function requestAppleWebCode(state: string): Promise<string> {
  const clientId = getAppleClientId();

  if (!clientId) {
    throw new Error('VITE_APPLE_CLIENT_ID 가 설정되지 않았다');
  }

  const appleAuth = await loadAppleSdk();

  appleAuth.init({
    clientId,
    scope: 'email',
    redirectURI: `${window.location.origin}/login/oauth2/code/apple`,
    state,
    usePopup: true,
  });

  let response: AppleSignInResponse;

  try {
    response = await appleAuth.signIn();
  } catch (error) {
    const name = readAppleErrorName(error);

    if (name && APPLE_CANCEL_ERRORS.includes(name)) {
      throw new BridgeError('CANCELLED');
    }

    throw new Error(`Apple 로그인에 실패했다: ${name ?? 'unknown'}`);
  }

  const code = response.authorization?.code;

  if (!code) {
    throw new Error('Apple 응답에 authorizationCode 가 없다');
  }

  if (response.authorization?.state !== state) {
    throw new Error('Apple 응답의 state 가 요청과 다르다');
  }

  return code;
}
