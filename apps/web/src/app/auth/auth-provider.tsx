import type { PropsWithChildren } from 'react';

import { restoreSession, useAuthStore } from '@/entities/auth';

/**
 * 앱 부팅 시 저장소에 남은 토큰으로 세션을 되살린다.
 *
 * 저장소 읽기는 동기이므로 effect가 아니라 첫 렌더 중에 끝낸다. effect로 미루면 그사이 나가는
 * 요청에 토큰이 빠진다. 이미 복원됐으면 아무 일도 하지 않아 StrictMode의 이중 렌더에도 안전하다.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  if (!useAuthStore.getState().isRestored) {
    restoreSession();
  }

  return <>{children}</>;
}
