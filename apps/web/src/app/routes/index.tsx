import { createFileRoute, redirect } from '@tanstack/react-router';

import { getSessionToken } from '@/entities/auth';
import { LoginPage } from '@/pages/login';

export const Route = createFileRoute('/')({
  // 첫 방문 화면이라 나누지 않는다. 나누면 첫 JS 실행 뒤에야 화면 청크를 요청해 왕복이 한 번 더 든다 (REF-072).
  codeSplitGroupings: [],
  // 이미 로그인한 사용자에게는 로그인 화면을 그리지 않는다. (기준선 L1)
  beforeLoad: () => {
    if (getSessionToken()) {
      throw redirect({ to: '/main' });
    }
  },
  component: LoginPage,
});
