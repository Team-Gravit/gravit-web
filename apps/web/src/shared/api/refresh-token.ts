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
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('재발급에 사용할 refreshToken이 없습니다');
  }

  // skipAuthRefresh로 인터셉터를 우회한다. 재발급이 401을 받으면 스스로를 다시 부르기 때문이다.
  const { accessToken } = await reissueToken({ refreshToken }, { skipAuthRefresh: true });

  if (!accessToken) {
    throw new Error('재발급 응답에 accessToken이 없습니다');
  }

  notifyTokenRefreshed(accessToken);

  return accessToken;
}
