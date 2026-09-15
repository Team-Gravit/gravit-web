import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useAuthStore } from '@/entities/auth';

import { LogoutButton } from './logout-button';

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

describe('LogoutButton', () => {
  it('클릭하면 세션과 Query 캐시를 비우고 onLoggedOut 을 1회 호출한다', async () => {
    localStorage.setItem('accessToken', 't1');
    useAuthStore.setState({ accessToken: 't1', isRestored: true });
    const queryClient = new QueryClient();
    queryClient.setQueryData(['/api/v1/users'], { nickname: 'gravit' });
    const onLoggedOut = vi.fn();

    render(<LogoutButton onLoggedOut={onLoggedOut} />, { wrapper: createWrapper(queryClient) });
    await userEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(onLoggedOut).toHaveBeenCalledTimes(1);
  });
});
