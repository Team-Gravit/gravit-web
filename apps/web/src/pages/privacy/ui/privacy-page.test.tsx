import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { PrivacyPage } from './privacy-page';

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
  render(<RouterProvider router={router as never} />);
}

describe('PrivacyPage', () => {
  // AC-1
  it('제목이 "개인정보 처리방침"이고 절이 9개다', async () => {
    await renderPrivacyPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('개인정보 처리방침');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(9);
  });

  // AC-3
  it('헤더 로고 링크가 홈으로 향한다', async () => {
    await renderPrivacyPage();

    const [homeLink] = await screen.findAllByRole('link');

    expect(homeLink).toHaveAttribute('href', '/');
  });
});
