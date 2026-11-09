import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { Toaster, toast } from '@/shared/ui/toast';
import { useAuthStore } from '@/entities/auth';

import { OauthCallbackPage } from './oauth-callback-page';

// 화면 이동 뒤에도 토스트가 보이는지 확인해야 하므로 실제 동작을 유지하며 호출 횟수를 센다.
vi.mock('@/shared/ui/toast', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui/toast')>();

  return { ...actual, toast: vi.fn(actual.toast) };
});

const OAUTH_ENDPOINT = '*/api/v1/oauth/google';
const LOGIN_FAILED_TEXT = '로그인에 실패했습니다. 다시 시도해 주세요.';
const PENDING_STATE_KEY = 'pendingOauthState';
const STATE = 'st_1';
const TEN_MINUTES_MS = 10 * 60 * 1000;

/** 로그인 버튼을 눌렀을 때 저장되는 값을 미리 넣는다. */
function savePendingState({
  provider = 'google',
  state = STATE,
  createdAt = Date.now(),
}: { provider?: string; state?: string; createdAt?: number } = {}) {
  localStorage.setItem(PENDING_STATE_KEY, JSON.stringify({ provider, state, createdAt }));
}

/** 교환 요청 횟수를 센다. */
function countExchange() {
  const requests = { count: 0 };
  server.use(
    http.post(OAUTH_ENDPOINT, () => {
      requests.count += 1;
      return HttpResponse.json({ accessToken: 't1', isOnboarded: true, role: 'USER' });
    }),
  );
  return requests;
}

/** 이동 목적지를 확인하려면 그 경로가 트리에 있어야 한다. 화면 내용은 검증 대상이 아니다. */
// state 가 없는 콜백은 null 로 표현한다. undefined 를 넘기면 기본값이 들어간다.
function renderCallback(code: string | undefined, state: string | null = STATE) {
  const rootRoute = createRootRoute();
  const routes = ['/', '/main', '/onboarding', '/restore'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: () => null }),
  );
  const callbackRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login/oauth2/code/$provider',
    component: () => <OauthCallbackPage provider="google" code={code} state={state ?? undefined} />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([...routes, callbackRoute]),
    history: createMemoryHistory({ initialEntries: ['/login/oauth2/code/google'] }),
  });

  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const element = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
      <Toaster />
    </QueryClientProvider>
  );
  const view = render(element);

  return { router, view, element };
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
  vi.mocked(toast).mockClear();
  vi.stubEnv('VITE_OAUTH_DEST', 'local');
  savePendingState();
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
          isOnboarded: true,
          role: 'USER',
        });
      }),
    );

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/main'));
    expect(body).toEqual({ code: 'abc123', state: STATE });
  });

  it('isOnboarded 가 true 면 세션을 만들고 /main 으로 이동한다 (AC-7)', async () => {
    server.use(
      http.post(OAUTH_ENDPOINT, () =>
        HttpResponse.json({
          accessToken: 't1',
          isOnboarded: true,
          role: 'USER',
        }),
      ),
    );

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/main'));
    expect(useAuthStore.getState().accessToken).toBe('t1');
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('hasSession')).not.toBeNull();
    // state 는 1회용이다. (AC-2)
    expect(localStorage.getItem(PENDING_STATE_KEY)).toBeNull();
  });

  it('isOnboarded 가 false 면 /onboarding 으로 이동한다', async () => {
    server.use(
      http.post(OAUTH_ENDPOINT, () =>
        HttpResponse.json({
          accessToken: 't1',
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
    expect(toast).not.toHaveBeenCalled();
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
    expect(toast).not.toHaveBeenCalled();
  });

  it('USER_423 이 아닌 실패면 / 로 이동한 뒤에도 실패 토스트가 보인다', async () => {
    server.use(http.post(OAUTH_ENDPOINT, () => new HttpResponse(null, { status: 500 })));

    const { router } = renderCallback('abc123');

    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(await screen.findByText(LOGIN_FAILED_TEXT)).toBeInTheDocument();
    expect(toast).toHaveBeenCalledTimes(1);
  });

  describe('state 확인', () => {
    it.each([
      ['콜백 state 가 저장값과 다르면', () => renderCallback('abc123', 'st_other')],
      ['콜백에 state 가 없으면', () => renderCallback('abc123', null)],
      [
        '저장값이 없으면',
        () => {
          localStorage.removeItem(PENDING_STATE_KEY);
          return renderCallback('abc123');
        },
      ],
      [
        '저장값이 10분 넘게 지났으면 (AC-4)',
        () => {
          savePendingState({ createdAt: Date.now() - TEN_MINUTES_MS - 1 });
          return renderCallback('abc123');
        },
      ],
      [
        '저장값의 제공자가 경로와 다르면 (AC-5)',
        () => {
          savePendingState({ provider: 'kakao' });
          return renderCallback('abc123');
        },
      ],
    ])('%s 로그인 요청 없이 실패 안내 후 / 로 이동한다 (AC-3)', async (_, render) => {
      const requests = countExchange();

      const { router } = render();

      await waitFor(() => expect(router.state.location.pathname).toBe('/'));
      expect(requests.count).toBe(0);
      expect(await screen.findByText(LOGIN_FAILED_TEXT)).toBeInTheDocument();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(localStorage.getItem(PENDING_STATE_KEY)).toBeNull();
    });
  });
});
