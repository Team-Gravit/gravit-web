import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { useAuthStore } from '@/entities/auth';

import { OnboardingPage } from './onboarding-page';

/** 테스트에서 뷰포트 상태를 고정한다. */
function stubViewport(isWide: boolean) {
  const listeners = new Set<() => void>();
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      matches: isWide,
      addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
    })),
  );
  return (nextIsWide: boolean) => {
    isWide = nextIsWide;
    act(() => {
      [...listeners].forEach((listener) => listener());
    });
  };
}

async function renderOnboardingPage() {
  const rootRoute = createRootRoute();
  const onboardingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/onboarding',
    component: OnboardingPage,
  });
  const otherRoutes = ['/', '/onboarding/success'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: () => null }),
  );

  const router = createRouter({
    routeTree: rootRoute.addChildren([onboardingRoute, ...otherRoutes]),
    history: createMemoryHistory({ initialEntries: ['/onboarding'] }),
  });
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  // 라우트 로딩이 끝난 뒤 화면을 렌더링한다.
  await router.load();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>,
  );

  return { router, user: userEvent.setup() };
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

afterEach(() => {
  vi.unstubAllGlobals();
  // 테스트마다 타이머를 초기화한다.
  vi.useRealTimers();
});

describe('OnboardingPage', () => {
  it('화면 전환 후에도 입력값과 선택한 색을 제출하고 요청 중 상태를 유지한다', async () => {
    const resize = stubViewport(true);
    let releaseResponse!: () => void;
    const responseReady = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    const bodies: unknown[] = [];
    server.use(
      http.post('*/api/v1/users/onboarding', async ({ request }) => {
        bodies.push(await request.json());
        await responseReady;
        return HttpResponse.json({ userId: 1, isOnboarded: true });
      }),
    );
    const { user, router } = await renderOnboardingPage();
    await user.type(screen.getByRole('textbox'), '그래빗');
    await user.click(screen.getByRole('button', { name: '다음 프로필 색' }));
    await screen.findByText('사용 가능한 닉네임이에요.');
    resize(false);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('그래빗');
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: '다음' }));
    await waitFor(() => expect(bodies).toEqual([{ nickname: '그래빗', profilePhotoNumber: 2 }]));
    resize(true);
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('그래빗');
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음' })).toHaveAttribute('aria-busy', 'true');
    releaseResponse();
    await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding/success'));
    expect(bodies).toHaveLength(1);
  });

  it('검증 대기 중 화면을 바꿔도 마지막 입력의 검증이 이어진다', async () => {
    const resize = stubViewport(false);
    await renderOnboardingPage();

    // 입력은 실제 이벤트로 처리하고 디바운스 타이머만 직접 진행한다.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '그래빗' } });
      act(() => vi.advanceTimersByTime(150));
      resize(true);
      expect(screen.getByRole('textbox')).toHaveValue('그래빗');
      expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
      act(() => vi.advanceTimersByTime(150));
      expect(screen.getByText('사용 가능한 닉네임이에요.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('좁은 화면이면 「로그인」 상단바와 「이전」·「다음」이 함께 있다', async () => {
    stubViewport(false);

    await renderOnboardingPage();

    expect(screen.getByRole('banner')).toHaveTextContent('로그인');
    expect(screen.getAllByRole('button', { name: '이전' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('넓은 화면이면 상단바와 「이전」이 없고 태그라인이 보인다', async () => {
    stubViewport(true);

    await renderOnboardingPage();

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '이전' })).not.toBeInTheDocument();
    expect(screen.getByText('그래빗과 함께 CS 지식을 마스터해요!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
  });

  it('닉네임 입력과 색 선택기가 두 화면 모두에 있다', async () => {
    stubViewport(true);

    await renderOnboardingPage();

    expect(screen.getByLabelText('닉네임 설정')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 프로필 색' })).toBeInTheDocument();
  });

  it('좁은 화면에서 온보딩을 취소하면 세션을 지우고 / 로 이동한다', async () => {
    stubViewport(false);
    localStorage.setItem('accessToken', 't1');
    localStorage.setItem('refreshToken', 'r1');
    useAuthStore.setState({ accessToken: 't1', isRestored: true });

    const { router, user } = await renderOnboardingPage();

    // 상단바와 하단의 「이전」은 같은 취소 동작을 사용한다.
    const [, bottomCancelButton] = screen.getAllByRole('button', { name: '이전' });
    await user.click(bottomCancelButton);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
