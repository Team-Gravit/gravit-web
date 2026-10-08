import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { useAuthStore } from '@/entities/auth';
import { server } from '@/shared/api/mocks/server';

import { OauthCallbackPage } from './oauth-callback-page';

const OAUTH_ENDPOINT = '*/api/v1/oauth/google';

/** 이동 목적지를 확인하려면 그 경로가 트리에 있어야 한다. 화면 내용은 검증 대상이 아니다. */
function renderCallback(code: string | undefined) {
  const rootRoute = createRootRoute();
  const routes = ['/', '/main', '/onboarding', '/restore'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: () => null }),
  );
  const callbackRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login/oauth2/code/$provider',
    component: () => <OauthCallbackPage provider="google" code={code} />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([...routes, callbackRoute]),
    history: createMemoryHistory({ initialEntries: ['/login/oauth2/code/google'] }),
  });

  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const element = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>
  );
  const view = render(element);

  return { router, view, element };
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
  vi.stubEnv('VITE_OAUTH_DEST', 'local');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('OauthCallbackPage', () => {
  it('리렌더가 2회 더 일어나도 코드 교환은 1회만 호출된다', async () => {
    let requestCount = 0;
    server.use(
      http.post(OAUTH_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({
          accessToken: 't1',
          refreshToken: 'r1',
          isOnboarded: true,
          role: 'USER',
        });
      }),
    );

    const { view, router, element } = renderCallback('abc123');
    view.rerender(element);
    view.rerender(element);

    await waitFor(() => expect(router.state.location.pathname).toBe('/main'));
    expect(requestCount).toBe(1);
  });

  it('요청 본문에 인가 코드가 담긴다', async () => {
    let body: unknown = null;
    server.use(
      http.post(OAUTH_ENDPOINT, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({
          accessToken: 't1',
          refreshToken: 'r1',
          isOnboarded: true,
          role: 'USER',
        });
      }),
    );

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/main'));
    expect(body).toEqual({ code: 'abc123' });
  });

  it('isOnboarded 가 true 면 토큰을 저장하고 /main 으로 이동한다', async () => {
    server.use(
      http.post(OAUTH_ENDPOINT, () =>
        HttpResponse.json({
          accessToken: 't1',
          refreshToken: 'r1',
          isOnboarded: true,
          role: 'USER',
        }),
      ),
    );

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/main'));
    expect(localStorage.getItem('accessToken')).toBe('t1');
    expect(localStorage.getItem('refreshToken')).toBe('r1');
  });

  it('isOnboarded 가 false 면 /onboarding 으로 이동한다', async () => {
    server.use(
      http.post(OAUTH_ENDPOINT, () =>
        HttpResponse.json({
          accessToken: 't1',
          refreshToken: 'r1',
          isOnboarded: false,
          role: 'USER',
        }),
      ),
    );

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding'));
  });

  it('USER_423 이면 /restore 로 providerId 를 실어 이동한다', async () => {
    server.use(
      http.post(OAUTH_ENDPOINT, () =>
        HttpResponse.json({ error: 'USER_423', message: 'google_123' }, { status: 423 }),
      ),
    );

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/restore'));
    expect(router.state.location.search).toEqual({ providerId: 'google_123' });
    // replace 로 이동해야 뒤로 가기가 소모된 코드로 되돌아가지 않는다.
    expect(router.history.length).toBe(1);
  });

  it('code 가 없으면 교환을 호출하지 않고 / 로 되돌린다', async () => {
    let requestCount = 0;
    server.use(
      http.post(OAUTH_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({});
      }),
    );

    const { router } = renderCallback(undefined);

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(requestCount).toBe(0);
  });

  it('USER_423 이 아닌 실패면 / 로 되돌려 빈 화면에 갇히지 않게 한다', async () => {
    server.use(http.post(OAUTH_ENDPOINT, () => new HttpResponse(null, { status: 500 })));

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
  });
});
