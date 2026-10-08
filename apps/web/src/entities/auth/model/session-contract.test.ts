import { beforeEach, describe, expect, it } from 'vitest';

import {
  getAuthToken,
  getRefreshToken,
  notifyTokenRefreshed,
  notifyUnauthorized,
} from '@/shared/api';

import { readStoredAccessToken, readStoredRefreshToken } from './auth-storage';
import { useAuthStore } from './auth-store';
import { clearSession, getSessionToken, restoreSession, setSession } from './session-contract';

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

describe('getSessionToken', () => {
  it('저장소에 accessToken 이 있으면 복원 전에도 그 값을 반환한다', () => {
    localStorage.setItem('accessToken', 'tok_abc');

    expect(getSessionToken()).toBe('tok_abc');
  });

  it('저장소가 비어 있으면 null 을 반환한다', () => {
    expect(getSessionToken()).toBeNull();
  });
});

describe('setSession', () => {
  it('저장소와 store 에 accessToken 을 함께 반영한다', () => {
    setSession({ accessToken: 'tok_new', refreshToken: 'ref_new' });

    expect(readStoredAccessToken()).toBe('tok_new');
    expect(readStoredRefreshToken()).toBe('ref_new');
    expect(useAuthStore.getState().accessToken).toBe('tok_new');
  });

  it('세션이 정해지면 isRestored 가 true 가 된다', () => {
    setSession({ accessToken: 'tok_new', refreshToken: 'ref_new' });

    expect(useAuthStore.getState().isRestored).toBe(true);
  });
});

describe('clearSession', () => {
  it('accessToken 과 refreshToken 을 모두 지운다', () => {
    setSession({ accessToken: 'tok_abc', refreshToken: 'ref_1' });

    clearSession();

    expect(readStoredAccessToken()).toBeNull();
    expect(readStoredRefreshToken()).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});

describe('restoreSession', () => {
  it('저장소에 토큰이 있으면 store 에 싣고 isRestored 를 true 로 만든다', () => {
    localStorage.setItem('accessToken', 'tok_abc');

    restoreSession();

    expect(useAuthStore.getState().accessToken).toBe('tok_abc');
    expect(useAuthStore.getState().isRestored).toBe(true);
  });

  it('저장소가 비어 있으면 accessToken 은 null 인 채로 isRestored 만 true 가 된다', () => {
    restoreSession();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isRestored).toBe(true);
  });

  it('호출 전에는 isRestored 가 false 다', () => {
    expect(useAuthStore.getState().isRestored).toBe(false);
  });
});

describe('HTTP 계층 주입', () => {
  it('shared 의 getAuthToken 이 세션 계약의 토큰을 읽는다', () => {
    setSession({ accessToken: 'tok_abc', refreshToken: 'ref_1' });

    expect(getAuthToken()).toBe('tok_abc');
  });

  it('notifyUnauthorized 를 호출하면 세션이 비워진다', () => {
    setSession({ accessToken: 'tok_abc', refreshToken: 'ref_1' });

    notifyUnauthorized();

    expect(readStoredAccessToken()).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});

describe('재발급 주입', () => {
  it('getRefreshToken 이 저장소의 refreshToken 을 반환한다', () => {
    setSession({ accessToken: 'tok_old', refreshToken: 'ref_1' });

    expect(getRefreshToken()).toBe('ref_1');
  });

  it('notifyTokenRefreshed 를 호출하면 accessToken 만 교체하고 refreshToken 은 유지한다', () => {
    setSession({ accessToken: 'tok_old', refreshToken: 'ref_1' });

    notifyTokenRefreshed('tok_new');

    expect(readStoredAccessToken()).toBe('tok_new');
    expect(readStoredRefreshToken()).toBe('ref_1');
    expect(useAuthStore.getState().accessToken).toBe('tok_new');
  });
});
