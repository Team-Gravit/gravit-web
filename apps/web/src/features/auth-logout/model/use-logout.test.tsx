import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  installNativeBridgeStub,
  uninstallNativeBridgeStub,
} from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';
import { restoreSession, setNativeSession, setWebSession, useAuthStore } from '@/entities/auth';

import { useLogout } from './use-logout';

const LOGOUT_ENDPOINT = '*/api/v1/auth/logout';
const REISSUE_ENDPOINT = '*/api/v1/auth/reissue';

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

/** 로그아웃 요청의 본문을 기록한다. */
function recordLogout(respond: () => Response = () => new HttpResponse(null, { status: 204 })) {
  const bodies: string[] = [];
  server.use(
    http.post(LOGOUT_ENDPOINT, async ({ request }) => {
      bodies.push(await request.text());
      return respond();
    }),
  );
  return bodies;
}

function renderLogout(queryClient = new QueryClient()) {
  const onSuccess = vi.fn();
  const { result } = renderHook(() => useLogout({ onSuccess }), {
    wrapper: createWrapper(queryClient),
  });

  return { logout: result.current, onSuccess };
}

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({ accessToken: null, isRestored: false });
});

// 로그아웃 후 어디로 가는지는 호출부의 몫이라 여기서 검증하지 않는다.
describe('useLogout — 웹', () => {
  it('세션 · 캐시 · 힌트를 지우고 onSuccess 를 부른 뒤 본문 없이 /auth/logout 을 호출한다 (AC-14)', async () => {
    setWebSession('t1');
    const bodies = recordLogout();
    const queryClient = new QueryClient();
    queryClient.setQueryData(['/api/v1/users'], { nickname: 'gravit' });
    const { logout, onSuccess } = renderLogout(queryClient);

    act(() => logout());

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(localStorage.getItem('hasSession')).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(bodies).toEqual(['']));
  });

  it('로그아웃 API 가 실패해도 새로고침 뒤 로그아웃 상태가 유지된다 (AC-15)', async () => {
    setWebSession('t1');
    const bodies = recordLogout(() => new HttpResponse(null, { status: 500 }));
    let reissueCount = 0;
    server.use(
      http.post(REISSUE_ENDPOINT, () => {
        reissueCount += 1;
        return HttpResponse.json({ accessToken: 't2' });
      }),
    );
    const { logout } = renderLogout();

    act(() => logout());
    await waitFor(() => expect(bodies).toHaveLength(1));

    // 새로고침 — 메모리가 비고 부팅 복원이 다시 돈다.
    useAuthStore.setState({ accessToken: null, isRestored: false });
    await expect(restoreSession()).resolves.toBe('none');
    expect(reissueCount).toBe(0);
  });

  it('로그아웃 API 가 401 이어도 재발급을 시도하지 않는다', async () => {
    setWebSession('t1');
    const bodies = recordLogout(() => new HttpResponse(null, { status: 401 }));
    let reissueCount = 0;
    server.use(
      http.post(REISSUE_ENDPOINT, () => {
        reissueCount += 1;
        return HttpResponse.json({ accessToken: 't2' });
      }),
    );
    const { logout } = renderLogout();

    act(() => logout());

    await waitFor(() => expect(bodies).toHaveLength(1));
    expect(reissueCount).toBe(0);
  });
});

describe('useLogout — 앱', () => {
  beforeEach(() => {
    installNativeBridgeStub();
  });

  afterEach(() => {
    uninstallNativeBridgeStub();
  });

  it('본문에 refreshToken 을 담아 호출하고 저장 토큰을 지운다 (AC-16)', async () => {
    setNativeSession({ accessToken: 't1', refreshToken: 'r1' });
    const bodies = recordLogout();
    const { logout } = renderLogout();

    act(() => logout());

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    await waitFor(() => expect(bodies).toHaveLength(1));
    expect(JSON.parse(bodies[0] ?? '')).toEqual({ refreshToken: 'r1' });
  });
});
