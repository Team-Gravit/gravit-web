import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { PrivacyPage } from './privacy-page';

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

/** `initialEntries`의 마지막이 현재 화면이다. 앞에 경로를 두면 이전 기록이 있는 상태가 된다. */
async function renderPrivacyPage(initialEntries = ['/privacy']) {
  const rootRoute = createRootRoute();
  const routes = ['/', '/settings', '/terms', '/privacy'].map((path) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: path === '/privacy' ? PrivacyPage : () => <p>다른 화면</p>,
    }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries, initialIndex: initialEntries.length - 1 }),
  });

  await router.load();

  return { router, ...render(<RouterProvider router={router as never} />) };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PrivacyPage', () => {
  it('제목이 "개인정보 처리방침"이고 절이 10개다', async () => {
    stubViewport(true);

    await renderPrivacyPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('개인정보 처리방침');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(10);
  });

  it('좁은 화면에서도 문서 제목은 상단바의 하나뿐이고 절 수가 같다', async () => {
    stubViewport(false);

    await renderPrivacyPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('개인정보 처리방침');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(10);
  });

  it('넓은 화면 헤더는 홈으로 가는 로고만 있고 메뉴는 없다', async () => {
    stubViewport(true);

    await renderPrivacyPage();

    expect(await screen.findByRole('link', { name: '홈으로 이동' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('navigation', { name: '주요 메뉴' })).not.toBeInTheDocument();
  });

  it('좁은 화면에서 이전 화면이 있으면 「뒤로 가기」가 그 화면으로 돌아간다', async () => {
    stubViewport(false);
    const user = userEvent.setup();
    const { router } = await renderPrivacyPage(['/settings', '/privacy']);

    await user.click(await screen.findByRole('link', { name: '뒤로 가기' }));

    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/settings'));
  });

  it('좁은 화면에서 직접 들어왔으면 「뒤로 가기」가 / 로 간다', async () => {
    stubViewport(false);

    await renderPrivacyPage();

    expect(await screen.findByRole('link', { name: '뒤로 가기' })).toHaveAttribute('href', '/');
  });

  // 푸터는 좌우 여백이 150px 고정이라 좁은 화면에서 쓸 수 없다. 숨기지 않고 아예 마운트하지 않는다.
  it('푸터는 넓은 화면에만 렌더된다', async () => {
    stubViewport(true);
    const { unmount } = await renderPrivacyPage();

    expect(await screen.findByRole('contentinfo')).toBeInTheDocument();

    unmount();
    stubViewport(false);
    await renderPrivacyPage();

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('처리위탁 표에 수탁업체가 모두 있다', async () => {
    stubViewport(true);

    await renderPrivacyPage();

    const table = await screen.findByRole('table');
    for (const company of [
      '카카오, 네이버, Google, Apple',
      'OpenAI',
      'Amazon Web Services (서울 리전)',
    ]) {
      expect(table).toHaveTextContent(company);
    }
  });
});
