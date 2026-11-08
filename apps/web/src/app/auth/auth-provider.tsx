import type { PropsWithChildren } from 'react';

import { restoreSession, useAuthStore } from '@/entities/auth';

/**
 * 앱 부팅 시 세션 복원을 시작한다. 완료를 기다리는 것은 인증 판단을 하는 라우트의 `beforeLoad`다.
 *
 * 앱은 저장소 읽기가 동기라 첫 렌더 중에 끝난다. effect로 미루면 그사이 나가는 요청에 토큰이 빠진다.
 * 웹은 재발급 요청을 여기서 바로 보내 라우트가 기다리는 시간을 줄인다.
 * 진행 중인 복원은 하나로 합쳐지므로 StrictMode의 이중 렌더에도 요청이 한 번만 나간다.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  if (!useAuthStore.getState().isRestored) {
    void restoreSession();
  }

  return <>{children}</>;
}
