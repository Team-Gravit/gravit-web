import { describe, expect, it, vi } from 'vitest';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SettingsPage } from './settings-page';

// 로그아웃 훅은 세션·쿼리 캐시에 의존하므로, onSuccess(=이동)만 남기고 대체한다.
vi.mock('@/features/auth-logout', () => ({
  useLogout: ({ onSuccess }: { onSuccess: () => void }) => onSuccess,
}));

function LoginMarker() {
  return <p>로그인 화면</p>;
}

async function renderSettingsPage() {
  const rootRoute = createRootRoute();
  const routes = [
    createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage }),
    createRoute({ getParentRoute: () => rootRoute, path: '/', component: LoginMarker }),
    createRoute({ getParentRoute: () => rootRoute, path: '/my', component: () => null }),
    createRoute({ getParentRoute: () => rootRoute, path: '/privacy', component: () => null }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/settings/notice',
      component: () => null,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/settings/inquiry',
      component: () => null,
    }),
  ];

  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/settings'] }),
  });

  await router.load();
  render(<RouterProvider router={router as never} />);
  return router;
}

describe('SettingsPage', () => {
  it('계정정보 2항목과 기타 3항목을 보여준다', async () => {
    await renderSettingsPage();

    for (const label of ['내 정보', '개인정보 처리 방침', '문의하기', '로그아웃', '탈퇴하기']) {
      expect(await screen.findByText(label)).toBeInTheDocument();
    }
  });

  it('개인정보 처리 방침은 /privacy 로 연결된다', async () => {
    await renderSettingsPage();

    const link = await screen.findByRole('link', { name: '개인정보 처리 방침' });
    expect(link).toHaveAttribute('href', '/privacy');
  });

  it('로그아웃을 누르면 로그인 화면(/)으로 이동한다', async () => {
    const router = await renderSettingsPage();

    await userEvent.click(await screen.findByRole('button', { name: '로그아웃' }));

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('탈퇴하기를 눌러도 화면을 벗어나지 않는다', async () => {
    const router = await renderSettingsPage();

    await userEvent.click(await screen.findByRole('button', { name: '탈퇴하기' }));

    expect(router.state.location.pathname).toBe('/settings');
  });
});
