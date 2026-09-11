import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';

import { OnboardingSuccessPage } from './onboarding-success-page';

/** 테스트에서 뷰포트 상태를 고정한다. */
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

// 완료 화면의 표시와 홈 링크를 확인한다.
async function renderSuccessPage() {
  const rootRoute = createRootRoute();
  const routes = [
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/onboarding/success',
      component: OnboardingSuccessPage,
    }),
    createRoute({ getParentRoute: () => rootRoute, path: '/main', component: () => null }),
  ];

  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/onboarding/success'] }),
  });

  await router.load();

  render(<RouterProvider router={router as never} />);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('OnboardingSuccessPage', () => {
  it('완료 안내와 「홈으로」를 보여준다', async () => {
    stubViewport(false);

    await renderSuccessPage();

    expect(await screen.findByText('계정 생성 완료!')).toBeInTheDocument();
    expect(screen.getByText('그래빗의 일원이 된 걸 환영해요!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈으로' })).toHaveAttribute('href', '/main');
  });

  it('완료 화면에는 상단바가 없다', async () => {
    stubViewport(false);

    await renderSuccessPage();

    await screen.findByText('계정 생성 완료!');

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('넓은 화면에서도 같은 안내와 「홈으로」가 있다', async () => {
    stubViewport(true);

    await renderSuccessPage();

    expect(await screen.findByText('계정 생성 완료!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈으로' })).toHaveAttribute('href', '/main');
  });
});
