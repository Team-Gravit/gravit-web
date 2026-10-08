import { createFileRoute, redirect } from '@tanstack/react-router';

import { getSessionToken } from '@/entities/auth';
import { LoginPage } from '@/pages/login';

export const Route = createFileRoute('/')({
  // 이미 로그인한 사용자에게는 로그인 화면을 그리지 않는다. (기준선 L1)
  beforeLoad: () => {
    if (getSessionToken()) {
      throw redirect({ to: '/main' });
    }
  },
  component: LoginPage,
});
