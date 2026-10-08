import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';

import { useAuthStore } from '@/entities/auth';

import { useLogout } from './use-logout';

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

// 로그아웃 후 어디로 가는지는 호출부의 몫이라 여기서 검증하지 않는다.
// 로그아웃 UI 를 만드는 작업에서 목적지를 확인한다.
describe('useLogout', () => {
  it('저장소 토큰과 Query 캐시를 비운 뒤 onSuccess 를 호출한다', () => {
    // 로그인한 상태를 만든다. store 를 비워둔 채로는 "지웠는지"를 확인할 수 없다.
    localStorage.setItem('accessToken', 't1');
    localStorage.setItem('refreshToken', 'r1');
    useAuthStore.setState({ accessToken: 't1', isRestored: true });

    const queryClient = new QueryClient();
    queryClient.setQueryData(['/api/v1/users'], { nickname: 'gravit' });
    expect(queryClient.getQueryCache().getAll()).toHaveLength(1);

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useLogout({ onSuccess }), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current();
    });

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
