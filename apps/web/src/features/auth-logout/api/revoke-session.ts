import { logout } from '@/shared/api/generated/authtoken-api/authtoken-api';

/**
 * 서버의 refreshToken을 무효화하고 쿠키를 만료시킨다. 결과를 기다리지 않는다.
 *
 * 웹은 본문 없이 쿠키로, 앱은 저장해 두었던 refreshToken을 본문에 담아 보낸다.
 * 이 기기의 세션은 호출 전에 이미 끝났으므로, 실패해도 다시 시도하지 않고 기록만 남긴다. (FEAT-080 ADR-5)
 */
export function revokeSession(refreshToken: string | null): void {
  const body = refreshToken ? { refreshToken } : undefined;

  // 세션이 이미 지워져 401을 받아도 재발급할 수 없다. 재발급 재시도에서 뺀다.
  logout(body, { skipAuthRefresh: true }).catch((error: unknown) => {
    console.warn('[auth] 로그아웃 요청이 실패했다. 서버 토큰은 만료까지 남는다', error);
  });
}
