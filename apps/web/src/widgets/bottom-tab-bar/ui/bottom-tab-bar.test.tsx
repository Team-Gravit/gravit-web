import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';

import { renderWithProviders } from '@/shared/lib/testing';

import { BottomTabBar } from './bottom-tab-bar';

describe('BottomTabBar', () => {
  it('탭 4개가 헤더와 같은 목적지를 가리킨다 (AC-3)', async () => {
    await renderWithProviders(BottomTabBar, {
      path: '/main',
      extraPaths: ['/learning', '/league', '/my'],
    });

    const tabBar = await screen.findByRole('navigation', { name: '하단 탭' });
    expect(
      within(tabBar)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/main', '/learning', '/league', '/my']);
  });

  it('/main 에서는 「홈」만 aria-current="page" 다 (AC-4)', async () => {
    await renderWithProviders(BottomTabBar, {
      path: '/main',
      extraPaths: ['/learning', '/league', '/my'],
    });

    const tabBar = await screen.findByRole('navigation', { name: '하단 탭' });
    const currentLinks = within(tabBar)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    expect(currentLinks.map((link) => link.textContent)).toEqual(['홈']);
  });
});
