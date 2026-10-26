import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getRequestMockHandler } from '@/shared/api/generated/mocks/user-deletion-api/user-deletion-api.msw';
import { server } from '@/shared/api/mocks/server';

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
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/withdraw-email-sent',
      component: () => null,
    }),
  ];

  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/settings'] }),
  });

  // 탈퇴 모달이 mutation 훅(useRequest)을 쓰므로 QueryClient 가 필요하다.
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  await router.load();
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );
  return router;
}

describe('SettingsPage', () => {
  it('각 섹션 별 2항목씩 보여준다', async () => {
    await renderSettingsPage();

    for (const label of [
      '공지사항',
      '문의하기',
      '이용약관',
      '개인정보 처리 방침',
      '로그아웃',
      '탈퇴하기',
    ]) {
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

  it('탈퇴하기를 누르면 확인 모달이 열리고 화면은 벗어나지 않는다', async () => {
    const router = await renderSettingsPage();

    await userEvent.click(await screen.findByRole('button', { name: '탈퇴하기' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '계속하기' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/settings');
  });

  it('모달에서 그만두기를 누르면 모달이 닫힌다', async () => {
    await renderSettingsPage();

    await userEvent.click(await screen.findByRole('button', { name: '탈퇴하기' }));
    await userEvent.click(await screen.findByRole('button', { name: '그만두기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('계속하기를 누르면 메일 발송 안내 페이지(/withdraw-email-sent)로 이동한다', async () => {
    // 메일 요청이 성공해야 이동한다. 생성된 핸들러로 202 를 돌려준다.
    server.use(getRequestMockHandler());
    const router = await renderSettingsPage();

    await userEvent.click(await screen.findByRole('button', { name: '탈퇴하기' }));
    await userEvent.click(await screen.findByRole('button', { name: '계속하기' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/withdraw-email-sent'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
