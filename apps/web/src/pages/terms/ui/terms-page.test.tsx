import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { TermsPage } from './terms-page';

async function renderTermsPage() {
  const rootRoute = createRootRoute();
  const routes = ['/', '/terms', '/privacy'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: TermsPage }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/terms'] }),
  });

  await router.load();
  render(<RouterProvider router={router as never} />);
}

describe('TermsPage', () => {
  // AC-1
  it('제목이 "서비스 이용약관"이고 조항이 13개다', async () => {
    await renderTermsPage();

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('서비스 이용약관');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(13);
  });

  // AC-3
  it('헤더 로고 링크가 홈으로 향한다', async () => {
    await renderTermsPage();

    const [homeLink] = await screen.findAllByRole('link');

    expect(homeLink).toHaveAttribute('href', '/');
  });
});
