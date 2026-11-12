import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { clearSession, useAuthStore } from '@/entities/auth';

import { queryClient } from './query-client';

const SAMPLE_KEY = ['sample'];

beforeEach(() => {
  useAuthStore.setState({ accessToken: 't1', isRestored: true });
  queryClient.setQueryData(SAMPLE_KEY, 'cached');
});

afterEach(() => {
  queryClient.clear();
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

describe('queryClient 세션 연동', () => {
  it('세션이 끝나면 캐시를 비운다', () => {
    clearSession();

    expect(queryClient.getQueryData(SAMPLE_KEY)).toBeUndefined();
  });

  it('재발급으로 토큰만 바뀌면 캐시를 유지한다', () => {
    useAuthStore.getState().setToken('t2');

    expect(queryClient.getQueryData(SAMPLE_KEY)).toBe('cached');
  });

  it('세션이 없던 상태에서 로그인해도 캐시를 비우지 않는다', () => {
    useAuthStore.setState({ accessToken: null });
    queryClient.setQueryData(SAMPLE_KEY, 'cached');

    useAuthStore.getState().setToken('t1');

    expect(queryClient.getQueryData(SAMPLE_KEY)).toBe('cached');
  });
});
