import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

async function renderPrivacyPage() {
  const rootRoute = createRootRoute();
  const routes = ['/', '/terms', '/privacy'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: PrivacyPage }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/privacy'] }),
  });

  await router.load();

  return render(<RouterProvider router={router as never} />);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PrivacyPage', () => {
  // AC-2 — 표현만 바꾸고 내용은 그대로임을 고정한다
  it('제목이 "개인정보 처리방침"이고 절이 9개다', async () => {
    stubViewport(true);

    await renderPrivacyPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('개인정보 처리방침');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(9);
  });

  it('좁은 화면에서도 문서 제목은 하나이고 절 수가 같다', async () => {
    stubViewport(false);

    await renderPrivacyPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('개인정보 처리방침');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(9);
  });

  it('넓은 화면에서 헤더 로고 링크가 홈으로 향한다', async () => {
    stubViewport(true);

    await renderPrivacyPage();

    const [homeLink] = await screen.findAllByRole('link');

    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('좁은 화면에는 뒤로 가기 버튼이 있다', async () => {
    stubViewport(false);

    await renderPrivacyPage();

    expect(await screen.findByRole('button', { name: '뒤로 가기' })).toBeInTheDocument();
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

  // AC-1 — 디자인 시스템을 우회하던 유틸리티가 남아 있지 않은지 본다.
  // 시각 검증이 아니라 회귀 가드다. 이 네 개가 다시 들어오면 토큰 체계가 깨진 것이다.
  it('타이포·굵기를 토큰 대신 직접 지정하던 클래스가 남아 있지 않다', async () => {
    stubViewport(true);

    const { container } = await renderPrivacyPage();

    expect(container.innerHTML).not.toMatch(
      /\btext-2xl\b|\btext-xl\b|\bfont-bold\b|\bfont-semibold\b/,
    );
  });
});
