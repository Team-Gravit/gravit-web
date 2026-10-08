import { Navigate, Outlet } from '@tanstack/react-router';

import { useAuthStore } from '@/entities/auth';

// beforeLoad만으로는 화면을 보는 중의 세션 삭제를 감지할 수 없어 스토어를 구독한다.
export function SessionGuard() {
  const hasSession = useAuthStore((state) => state.accessToken !== null);

  if (!hasSession) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
