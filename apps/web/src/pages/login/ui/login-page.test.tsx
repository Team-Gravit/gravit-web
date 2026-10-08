import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';

import { LoginPage } from './login-page';

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
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LoginPage', () => {
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
