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
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import {
  failFromNative,
  installNativeBridgeStub,
  respondFromNative,
  uninstallNativeBridgeStub,
  type NativeBridgeStub,
} from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';
import { toast } from '@/shared/ui/toast';
import { clearSession } from '@/entities/auth';

import { LoginPage } from './login-page';

// 토스트는 다시 띄우면 기존 것을 대체한다. 중복 안내를 잡기 위해 호출 횟수를 센다.
vi.mock('@/shared/ui/toast', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui/toast')>();

  return { ...actual, toast: vi.fn() };
});

const KAKAO_LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/kakao';
const LOGIN_FAILED_TEXT = '로그인에 실패했습니다. 다시 시도해 주세요.';
const ID_TOKEN_ENDPOINT = '*/api/v1/oauth/android';
const LOGIN_RESPONSE = {
  accessToken: 'at_1',
  refreshToken: 'rt_1',
  isOnboarded: false,
  role: 'USER',
};

/** 넓은 화면 여부를 고정한다. jsdom 에는 matchMedia 가 없다. */
function stubViewport(isWide: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      matches: isWide,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

async function renderLoginPage() {
  const rootRoute = createRootRoute();
  const rootRouteChildren = [
    createRoute({ getParentRoute: () => rootRoute, path: '/', component: LoginPage }),
    createRoute({ getParentRoute: () => rootRoute, path: '/privacy', component: () => null }),
    createRoute({ getParentRoute: () => rootRoute, path: '/terms', component: () => null }),
    // 네이티브 로그인 결과의 목적지. 도착 여부만 보므로 화면은 비운다.
    createRoute({ getParentRoute: () => rootRoute, path: '/onboarding', component: () => null }),
    createRoute({ getParentRoute: () => rootRoute, path: '/main', component: () => null }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/restore',
      component: () => null,
      validateSearch: (search: Record<string, unknown>) => ({
        providerId: typeof search.providerId === 'string' ? search.providerId : '',
      }),
    }),
  ];
  const router = createRouter({
    routeTree: rootRoute.addChildren(rootRouteChildren),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  // 이걸 빼면 첫 렌더가 비어 있어 "요소를 찾을 수 없다"로 실패한다.
  await router.load();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );

  return router;
}

beforeEach(() => {
  vi.mocked(toast).mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LoginPage', () => {
  it('브라우저에서 인가 URL 조회가 실패하면 실패 토스트가 1회 뜨고 / 에 남는다', async () => {
    stubViewport(false);
    server.use(http.get(KAKAO_LOGIN_URL_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
    const router = await renderLoginPage();
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    await userEvent.click(button);

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
    expect(toast).toHaveBeenCalledWith(LOGIN_FAILED_TEXT, { position: 'noneTabBottom' });
    await waitFor(() => expect(button).toBeEnabled());
    expect(router.state.location.pathname).toBe('/');
  });

  it('소셜 로그인 버튼이 Google · 카카오 · 네이버 순서로 3개 렌더된다', async () => {
    stubViewport(false);

    await renderLoginPage();

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Google로 시작하기',
      '카카오로 시작하기',
      '네이버로 시작하기',
    ]);
  });

  it('개인정보 처리방침과 이용약관 링크가 각각 하나씩 있고 목적지가 /privacy · /terms 다', async () => {
    stubViewport(false);

    await renderLoginPage();

    expect(screen.getByRole('link', { name: '개인정보 처리방침' })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(screen.getByRole('link', { name: '이용약관' })).toHaveAttribute('href', '/terms');
  });

  it('넓은 화면이면 상단바 없이 「그래빗과 함께 CS 지식을 마스터해요!」를 렌더한다', async () => {
    stubViewport(true);

    await renderLoginPage();

    expect(screen.getByText('그래빗과 함께 CS 지식을 마스터해요!')).toBeInTheDocument();
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('좁은 화면이면 「로그인」 상단바와 「교육행성에 어서 오세요.」를 렌더한다', async () => {
    stubViewport(false);

    await renderLoginPage();

    expect(screen.getByRole('banner')).toHaveTextContent('로그인');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('교육행성에 어서 오세요.');
    expect(screen.queryByText('그래빗과 함께 CS 지식을 마스터해요!')).not.toBeInTheDocument();
  });
});

describe('LoginPage — 앱 환경 네이티브 로그인', () => {
  let bridge: NativeBridgeStub;

  beforeEach(() => {
    stubViewport(false);
    bridge = installNativeBridgeStub();
  });

  afterEach(() => {
    uninstallNativeBridgeStub();
    clearSession();
  });

  async function clickKakaoAndReadRequestId() {
    await userEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));
    await waitFor(() => expect(bridge.postMessage).toHaveBeenCalledTimes(1));

    return bridge.readLastRequest().id;
  }

  it('교환 응답이 isOnboarded: false 면 /onboarding 으로 이동한다', async () => {
    server.use(http.post(ID_TOKEN_ENDPOINT, () => HttpResponse.json(LOGIN_RESPONSE)));
    const router = await renderLoginPage();

    const id = await clickKakaoAndReadRequestId();
    respondFromNative(id, { tokenType: 'idToken', token: 'kakao_id_tok' });

    await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding'));
  });

  it('교환 응답이 isOnboarded: true 면 /main 으로 이동한다', async () => {
    server.use(
      http.post(ID_TOKEN_ENDPOINT, () =>
        HttpResponse.json({ ...LOGIN_RESPONSE, isOnboarded: true }),
      ),
    );
    const router = await renderLoginPage();

    const id = await clickKakaoAndReadRequestId();
    respondFromNative(id, { tokenType: 'idToken', token: 'kakao_id_tok' });

    await waitFor(() => expect(router.state.location.pathname).toBe('/main'));
  });

  it('교환이 423 USER_423 이면 /restore 로 providerId 와 함께 이동한다', async () => {
    server.use(
      http.post(ID_TOKEN_ENDPOINT, () =>
        HttpResponse.json({ error: 'USER_423', message: 'pid_9' }, { status: 423 }),
      ),
    );
    const router = await renderLoginPage();

    const id = await clickKakaoAndReadRequestId();
    respondFromNative(id, { tokenType: 'idToken', token: 'kakao_id_tok' });

    await waitFor(() => expect(router.state.location.pathname).toBe('/restore'));
    expect(router.state.location.search).toEqual({ providerId: 'pid_9' });
    expect(toast).not.toHaveBeenCalled();
  });

  it('네이티브가 CANCELLED 로 실패하면 라우터 위치는 / 그대로이고 버튼이 풀리며 토스트는 없다', async () => {
    const router = await renderLoginPage();
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    const id = await clickKakaoAndReadRequestId();
    failFromNative(id, 'CANCELLED');

    await waitFor(() => expect(button).toBeEnabled());
    expect(router.state.location.pathname).toBe('/');
    expect(toast).not.toHaveBeenCalled();
  });

  it.each(['NATIVE_ERROR', 'TIMEOUT'] as const)(
    '네이티브가 %s 로 실패하면 실패 토스트가 1회 뜨고 버튼이 풀리며 / 에 남는다',
    async (code) => {
      const router = await renderLoginPage();
      const button = screen.getByRole('button', { name: '카카오로 시작하기' });

      const id = await clickKakaoAndReadRequestId();
      failFromNative(id, code);

      await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
      expect(toast).toHaveBeenCalledWith(LOGIN_FAILED_TEXT, { position: 'noneTabBottom' });
      await waitFor(() => expect(button).toBeEnabled());
      expect(router.state.location.pathname).toBe('/');
    },
  );

  it('토큰 교환이 500 이면 실패 토스트가 1회 뜨고 / 에 남는다', async () => {
    server.use(http.post(ID_TOKEN_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
    const router = await renderLoginPage();

    const id = await clickKakaoAndReadRequestId();
    respondFromNative(id, { tokenType: 'idToken', token: 'kakao_id_tok' });

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
    expect(toast).toHaveBeenCalledWith(LOGIN_FAILED_TEXT, { position: 'noneTabBottom' });
    expect(router.state.location.pathname).toBe('/');
  });
});
