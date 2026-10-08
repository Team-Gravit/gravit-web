import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from '@testing-library/react';

import { renderWithProviders } from '@/shared/lib/testing';
import { clearSession, useAuthStore } from '@/entities/auth';

import { SessionGuard } from './session-guard';

beforeEach(() => {
  localStorage.setItem('accessToken', 't1');
  useAuthStore.setState({ accessToken: 't1', isRestored: true });
});

afterEach(() => {
  localStorage.clear();
});

describe('SessionGuard', () => {
  it('보는 중에 세션이 지워지면 새로고침 없이 로그인(/)으로 이동한다', async () => {
    const { router } = await renderWithProviders(SessionGuard, {
      path: '/main',
      extraPaths: ['/'],
    });
    expect(router.state.location.pathname).toBe('/main');

    act(() => clearSession());

    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/'));
  });

  it('세션이 있으면 이동하지 않는다', async () => {
    const { router } = await renderWithProviders(SessionGuard, {
      path: '/main',
      extraPaths: ['/'],
    });

    expect(router.state.location.pathname).toBe('/main');
  });
});
