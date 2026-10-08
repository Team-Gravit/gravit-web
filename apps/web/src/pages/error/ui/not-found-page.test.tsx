import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/shared/lib/testing';

import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  it('안내 문구와 메인으로 가는 링크를 보인다', async () => {
    await renderWithProviders(NotFoundPage, { path: '/notifications', extraPaths: ['/main'] });

    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없어요.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '메인으로' })).toHaveAttribute('href', '/main');
  });

  it('이전 화면이 있으면 「돌아가기」가 그 화면으로 돌아간다', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithProviders(NotFoundPage, {
      path: '/notifications',
      extraPaths: ['/learning', '/main'],
    });
    await router.navigate({ to: '/learning' });
    await router.navigate({ to: '/notifications' });

    await user.click(await screen.findByRole('button', { name: '돌아가기' }));

    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/learning'));
  });

  it('이전 화면이 없으면 「돌아가기」가 메인으로 간다', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithProviders(NotFoundPage, {
      path: '/notifications',
      extraPaths: ['/main'],
    });

    await user.click(screen.getByRole('button', { name: '돌아가기' }));

    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/main'));
  });
});
