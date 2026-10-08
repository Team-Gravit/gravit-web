import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { Footer } from './footer';

// Footer 는 <Link> 를 쓰므로 라우터 컨텍스트가 필요하다.
// 실제 routeTree 를 끌어오면 앱 전체가 딸려오므로 최소 트리를 만든다.
// router.load() 를 기다리지 않으면 첫 렌더가 비어 있다.
async function renderFooter() {
  const rootRoute = createRootRoute();
  const routes = ['/', '/terms', '/privacy'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: Footer }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  await router.load();

  // 최소 트리라 앱의 실제 라우트 타입과 다르다. 렌더 자체가 목적이므로 여기서만 캐스팅한다.
  render(<RouterProvider router={router as never} />);
}

describe('Footer', () => {
  // AC-4
  it('개인정보 처리방침과 서비스 이용약관 링크가 각각 하나씩 있다', async () => {
    await renderFooter();

    expect(await screen.findByRole('link', { name: '개인정보 처리방침' })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(screen.getByRole('link', { name: '서비스 이용약관' })).toHaveAttribute('href', '/terms');
  });

  // AC-4
  it('문의 메일이 mailto 링크로 노출된다', async () => {
    await renderFooter();

    expect(await screen.findByRole('link', { name: /@/ })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:'),
    );
  });

  it('저작권 문구가 노출된다', async () => {
    await renderFooter();

    expect(
      await screen.findByText('Copyright 2026. Gravit! All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('주소와 문의 메일이 라벨과 값 쌍으로 노출된다', async () => {
    await renderFooter();

    expect(await screen.findByText('주소')).toBeInTheDocument();
    expect(
      screen.getByText('인천광역시 연수구 아카데미로 119 정보전산원 앱센터'),
    ).toBeInTheDocument();
  });

  it('앱센터 로고에 대체 텍스트가 있다', async () => {
    await renderFooter();

    expect(await screen.findByRole('img', { name: '앱센터 로고' })).toBeInTheDocument();
  });
});
