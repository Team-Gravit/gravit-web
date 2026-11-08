import type { ReactNode } from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { clearSession, useAuthStore } from '@/entities/auth';
import { getUserQueryKey } from '@/entities/user';
import { queryClient as appQueryClient } from '@/app/query/query-client';

import { routeTree } from '../../routeTree.gen';
import { Route } from './route';
import type { RouterContext } from '../__root';

const USER_ENDPOINT = '*/api/v1/users';
const USER_CHECK_FAILED_MESSAGE = '사용자 정보를 불러오지 못했어요.';
const FIVE_MINUTES_MS = 5 * 60 * 1000;

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

const runGate = Route.options.beforeLoad as unknown as (options: {
  context: RouterContext;
  location: { pathname: string };
}) => Promise<void>;

/** 사용자 조회 응답을 등록하고 요청 횟수를 돌려준다. */
function mockUser(isOnboarded: boolean) {
  const requests = { count: 0 };
  server.use(
    http.get(USER_ENDPOINT, () => {
      requests.count += 1;
      return HttpResponse.json({ userId: 1, isOnboarded });
    }),
  );
  return requests;
}

function mockUserNotFound() {
  server.use(
    http.get(USER_ENDPOINT, () =>
      HttpResponse.json(
        { error: 'USER_4041', message: '존재하지 않는 유저입니다.' },
        { status: 404 },
      ),
    ),
  );
}

/** 화면을 그리지 않고 실제 라우트 트리의 가드만 실행해 최종 경로를 돌려준다. */
async function resolvePath(
  path: string,
  { state, queryClient = createQueryClient() }: { state?: object; queryClient?: QueryClient } = {},
) {
  const history = createMemoryHistory({ initialEntries: [path] });
  if (state) {
    history.replace(path, state);
  }
  const router = createRouter({ routeTree, history, context: { queryClient } });

  await router.load();

  return router.state.location.pathname;
}

/** 실제 게이트 옵션에 최소 자식만 붙여 화면까지 그린다. */
async function renderGate(
  MainComponent: () => ReactNode = () => <p>메인 화면</p>,
  queryClient: QueryClient = createQueryClient(),
) {
  const rootRoute = createRootRouteWithContext<RouterContext>()({ component: Outlet });
  const gateRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'gate',
    beforeLoad: ({ context, location }) => runGate({ context, location }),
    pendingComponent: Route.options.pendingComponent,
    errorComponent: Route.options.errorComponent,
    pendingMs: 0,
    component: Outlet,
  });
  const mainRoute = createRoute({
    getParentRoute: () => gateRoute,
    path: '/main',
    component: MainComponent,
  });
  const publicRoutes = ['/', '/onboarding'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: () => <p>{path}</p> }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren([gateRoute.addChildren([mainRoute]), ...publicRoutes]),
    history: createMemoryHistory({ initialEntries: ['/main'] }),
    context: { queryClient },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );

  return { router };
}

// 웹 로그인 직후 상태 — 토큰은 store 에만 있고 저장소에는 힌트만 있다.
beforeEach(() => {
  localStorage.setItem('hasSession', '1');
  useAuthStore.setState({ accessToken: 't1', isRestored: true });
});

afterEach(() => {
  appQueryClient.clear();
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

describe('온보딩 게이트 — 경로 판정', () => {
  it.each(['/main', '/learning', '/my/summary', '/settings', '/notifications'])(
    '미온보딩 사용자가 %s 로 들어오면 /onboarding 으로 이동한다',
    async (path) => {
      mockUser(false);

      await expect(resolvePath(path)).resolves.toBe('/onboarding');
    },
  );

  it('미온보딩 사용자가 / 로 들어오면 /onboarding 으로 이동한다', async () => {
    mockUser(false);

    await expect(resolvePath('/')).resolves.toBe('/onboarding');
  });

  it('미온보딩 사용자는 /onboarding 에 머물고 사용자 조회는 1회다', async () => {
    const requests = mockUser(false);

    await expect(resolvePath('/onboarding')).resolves.toBe('/onboarding');
    expect(requests.count).toBe(1);
  });

  it('미온보딩 사용자는 완료 화면 통과권이 있어도 /onboarding 으로 이동한다', async () => {
    mockUser(false);

    await expect(
      resolvePath('/onboarding/success', { state: { fromOnboarding: true } }),
    ).resolves.toBe('/onboarding');
  });

  it('온보딩 완료 사용자는 /main 에 머문다', async () => {
    mockUser(true);

    await expect(resolvePath('/main')).resolves.toBe('/main');
  });

  it('온보딩 완료 사용자가 /onboarding 으로 들어오면 /main 으로 이동한다', async () => {
    mockUser(true);

    await expect(resolvePath('/onboarding')).resolves.toBe('/main');
  });

  it('제출 응답이 캐시에 있으면 추가 조회 없이 완료 화면에 들어간다', async () => {
    const requests = mockUser(false);
    const queryClient = createQueryClient();
    queryClient.setQueryData(getUserQueryKey(), { userId: 1, isOnboarded: true } as never);

    await expect(
      resolvePath('/onboarding/success', { state: { fromOnboarding: true }, queryClient }),
    ).resolves.toBe('/onboarding/success');
    expect(requests.count).toBe(0);
  });

  it('토큰이 없으면 사용자를 조회하지 않고 / 로 이동한다', async () => {
    const requests = mockUser(false);
    localStorage.clear();
    useAuthStore.setState({ accessToken: null });

    await expect(resolvePath('/main')).resolves.toBe('/');
    expect(requests.count).toBe(0);
  });
});

describe('온보딩 게이트 — 조회 실패와 대기', () => {
  it('사용자 조회가 500 이면 경로를 유지하고 재시도 화면을 보여준다', async () => {
    server.use(http.get(USER_ENDPOINT, () => new HttpResponse(null, { status: 500 })));

    const { router } = await renderGate();

    expect(await screen.findByText(USER_CHECK_FAILED_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
    expect(screen.queryByText('메인 화면')).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/main');
  });

  it('「다시 시도」를 누르고 조회가 성공하면 화면에 들어간다', async () => {
    server.use(http.get(USER_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
    await renderGate();
    const retryButton = await screen.findByRole('button', { name: '다시 시도' });

    mockUser(true);
    await userEvent.click(retryButton);

    expect(await screen.findByText('메인 화면')).toBeInTheDocument();
    expect(screen.queryByText(USER_CHECK_FAILED_MESSAGE)).not.toBeInTheDocument();
  });

  it('조회와 재발급이 모두 401 이면 세션을 지우고 / 로 이동한다', async () => {
    server.use(
      http.get(USER_ENDPOINT, () => new HttpResponse(null, { status: 401 })),
      http.post('*/api/v1/auth/reissue', () => new HttpResponse(null, { status: 401 })),
    );

    const { router } = await renderGate();

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(localStorage.getItem('hasSession')).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(screen.queryByText('메인 화면')).not.toBeInTheDocument();
  });

  it('사용자 조회가 USER_4041 이면 세션을 지우고 / 로 이동한다', async () => {
    mockUserNotFound();

    const { router } = await renderGate();

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(localStorage.getItem('hasSession')).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(screen.queryByText(USER_CHECK_FAILED_MESSAGE)).not.toBeInTheDocument();
  });

  it('「다시 시도」 뒤 USER_4041 이 오면 재시도 화면에 남지 않고 / 로 이동한다', async () => {
    server.use(http.get(USER_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
    const { router } = await renderGate();
    const retryButton = await screen.findByRole('button', { name: '다시 시도' });

    mockUserNotFound();
    await userEvent.click(retryButton);

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(screen.queryByText(USER_CHECK_FAILED_MESSAGE)).not.toBeInTheDocument();
    expect(localStorage.getItem('hasSession')).toBeNull();
  });

  it('USER_4041 이면 실제 라우트에서 /main 으로 되돌아가지 않고 / 에 머문다', async () => {
    mockUserNotFound();

    await expect(resolvePath('/main')).resolves.toBe('/');
  });

  it('서버 코드 없는 404 는 세션을 유지하고 재시도 화면을 보여준다', async () => {
    server.use(http.get(USER_ENDPOINT, () => new HttpResponse(null, { status: 404 })));

    const { router } = await renderGate();

    expect(await screen.findByText(USER_CHECK_FAILED_MESSAGE)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/main');
    expect(useAuthStore.getState().accessToken).toBe('t1');
    expect(localStorage.getItem('hasSession')).toBe('1');
  });

  it('구독하는 화면 없이 5분이 지나도 사용자를 다시 조회하지 않는다', async () => {
    const requests = mockUser(true);
    const queryClient = createQueryClient();
    const options = { context: { queryClient }, location: { pathname: '/main' } };
    // MSW 응답은 실제 시간으로 진행하고 gc 타이머만 앞당긴다.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true });

    try {
      await runGate(options);
      await vi.advanceTimersByTimeAsync(FIVE_MINUTES_MS + 1);
      await runGate(options);
    } finally {
      vi.useRealTimers();
    }

    expect(requests.count).toBe(1);
  });

  it('조회와 재발급이 모두 401 이면 앱 쿼리 캐시도 비운다', async () => {
    server.use(
      http.get(USER_ENDPOINT, () => new HttpResponse(null, { status: 401 })),
      http.post('*/api/v1/auth/reissue', () => new HttpResponse(null, { status: 401 })),
    );
    appQueryClient.setQueryData(['sample'], 'cached');

    const { router } = await renderGate(undefined, appQueryClient);

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(appQueryClient.getQueryData(['sample'])).toBeUndefined();
    expect(screen.queryByText(USER_CHECK_FAILED_MESSAGE)).not.toBeInTheDocument();
  });

  it('조회를 기다리는 중 세션이 끝나면 재시도 화면 없이 / 로 이동한다', async () => {
    let releaseResponse!: () => void;
    const responseReady = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    let hasRequestArrived = false;
    server.use(
      http.get(USER_ENDPOINT, async () => {
        hasRequestArrived = true;
        await responseReady;
        return HttpResponse.json({ userId: 1, isOnboarded: true });
      }),
    );

    const { router } = await renderGate(undefined, appQueryClient);
    await waitFor(() => expect(hasRequestArrived).toBe(true));

    act(() => clearSession());

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(screen.queryByText(USER_CHECK_FAILED_MESSAGE)).not.toBeInTheDocument();
    releaseResponse();
  });

  it('조회 응답을 기다리는 동안 화면 대신 대기 표시를 보여준다', async () => {
    server.use(
      http.get(USER_ENDPOINT, async () => {
        await delay(100);
        return HttpResponse.json({ userId: 1, isOnboarded: true });
      }),
    );

    await renderGate();

    expect(await screen.findByRole('status')).toHaveTextContent('불러오는 중');
    expect(screen.queryByText('메인 화면')).not.toBeInTheDocument();
    expect(await screen.findByText('메인 화면')).toBeInTheDocument();
  });

  it('자식 화면의 렌더 에러는 사용자 조회 실패로 표시하지 않는다', async () => {
    mockUser(true);

    await renderGate(() => {
      throw new Error('화면 렌더 실패');
    });

    expect(await screen.findByText('화면 렌더 실패')).toBeInTheDocument();
    expect(screen.queryByText(USER_CHECK_FAILED_MESSAGE)).not.toBeInTheDocument();
  });
});

describe('인증 게이트 — 웹 세션 복원', () => {
  const REISSUE_ENDPOINT = '*/api/v1/auth/reissue';

  // 새로고침 직후 상태 — 메모리의 토큰은 사라지고 힌트만 남는다.
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, isRestored: false });
  });

  it('힌트가 있으면 재발급을 기다린 뒤 판단해 /main 에 머문다 (AC-9)', async () => {
    server.use(
      http.post(REISSUE_ENDPOINT, async () => {
        await delay(50);
        return HttpResponse.json({ accessToken: 't2' });
      }),
    );
    mockUser(true);

    await expect(resolvePath('/main')).resolves.toBe('/main');
    expect(useAuthStore.getState().accessToken).toBe('t2');
  });

  it('힌트가 없으면 재발급 없이 / 로 이동한다 (AC-8)', async () => {
    localStorage.clear();
    let reissueCount = 0;
    server.use(
      http.post(REISSUE_ENDPOINT, () => {
        reissueCount += 1;
        return HttpResponse.json({ accessToken: 't2' });
      }),
    );

    await expect(resolvePath('/main')).resolves.toBe('/');
    expect(reissueCount).toBe(0);
  });

  it('재발급이 5xx 면 재시도 화면을 보이고, 다시 시도해 성공하면 들어간다 (AC-11)', async () => {
    server.use(http.post(REISSUE_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
    mockUser(true);

    const { router } = await renderGate();
    const retryButton = await screen.findByRole('button', { name: '다시 시도' });
    expect(router.state.location.pathname).toBe('/main');
    expect(localStorage.getItem('hasSession')).toBe('1');

    server.use(http.post(REISSUE_ENDPOINT, () => HttpResponse.json({ accessToken: 't2' })));
    await userEvent.click(retryButton);

    expect(await screen.findByText('메인 화면')).toBeInTheDocument();
  });
});
