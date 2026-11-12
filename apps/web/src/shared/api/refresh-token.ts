import { isAxiosError } from 'axios';

import { getRefreshToken, notifyTokenRefreshed } from './auth-token';
import { reissueToken } from './generated/authtoken-api/authtoken-api';

let pendingRefresh: Promise<string> | null = null;

/**
 * 만료된 accessToken을 재발급한다.
 *
 * 동시에 여러 요청이 401을 받아도 재발급은 한 번만 나가고 모두 같은 결과를 공유한다.
 * 진행 중인 요청이 있으면 그 약속을 그대로 돌려준다. (기준선 C6)
 */
export function refreshAccessToken(): Promise<string> {
  pendingRefresh ??= requestReissue().finally(() => {
    pendingRefresh = null;
  });

  return pendingRefresh;
}

async function requestReissue(): Promise<string> {
  // 앱은 저장한 refreshToken을 본문에 싣고, 웹은 본문 없이 쿠키로 재발급한다.
  // 웹은 쿠키가 있는지 알 수 없으므로 미리 실패시키지 않고 서버의 거절(4xx)을 따른다.
  const refreshToken = getRefreshToken();
  const body = refreshToken ? { refreshToken } : undefined;

  // skipAuthRefresh로 인터셉터를 우회한다. 재발급이 401을 받으면 스스로를 다시 부르기 때문이다.
  const { accessToken } = await reissueToken(body, { skipAuthRefresh: true });

  if (!accessToken) {
    throw new Error('재발급 응답에 accessToken이 없습니다');
  }

  notifyTokenRefreshed(accessToken);

  return accessToken;
}

// 재발급 거절 코드가 명세에 없어 4xx를 거절로 취급하고, 5xx·네트워크 오류는 세션을 유지한다.
export function isRefreshRejected(error: unknown): boolean {
  if (!isAxiosError(error)) {
    // 응답에 새 토큰이 없으면 재발급을 이어갈 수 없다.
    return true;
  }

  const status = error.response?.status;
  return status !== undefined && status >= 400 && status < 500;
}
