import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { getSessionToken } from '@/entities/auth';

// 인증 게이트. 토큰이 없으면 로그인('/')으로 돌려보낸다. 하위 모든 라우트가 이 가드를 거친다.
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!getSessionToken()) {
      throw redirect({ to: '/' });
    }
  },
  component: Outlet,
});
