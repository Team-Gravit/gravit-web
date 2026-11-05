import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { clearSession, getSessionToken } from '@/entities/auth';
import {
  installNativeBridgeStub,
  respondFromNative,
  uninstallNativeBridgeStub,
  type NativeBridgeStub,
} from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';

import { useNativeLogin } from './use-native-login';

const ID_TOKEN_ENDPOINT = '*/api/v1/oauth/android';
const NAVER_ENDPOINT = '*/api/v1/oauth/android/naver';

const LOGIN_RESPONSE = {
  accessToken: 'at_1',
  refreshToken: 'rt_1',
  isOnboarded: false,
  role: 'USER',
};

const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

function Wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

let bridge: NativeBridgeStub;

/** 네이티브가 SDK 토큰을 돌려준 것처럼 응답한다. 요청이 나갈 때까지 기다린다. */
async function resolveNativeLogin(token: { tokenType: 'idToken' | 'accessToken'; token: string }) {
  await waitFor(() => expect(bridge.postMessage).toHaveBeenCalledTimes(1));
  respondFromNative(bridge.readLastRequest().id, token);
}

beforeEach(() => {
  bridge = installNativeBridgeStub();
});

afterEach(() => {
  uninstallNativeBridgeStub();
  clearSession();
});

describe('useNativeLogin', () => {
  it('kakao 는 AUTH_LOGIN 으로 받은 idToken 을 ?provider=kakao 로 교환하고 세션을 만든다', async () => {
    const received = vi.fn();
    server.use(
      http.post(ID_TOKEN_ENDPOINT, async ({ request }) => {
        received(new URL(request.url).searchParams.get('provider'), await request.json());
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    );
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('kakao');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'kakao_id_tok' });

    expect(bridge.readLastRequest()).toMatchObject({
      type: 'AUTH_LOGIN',
      payload: { provider: 'kakao' },
    });
    await expect(pending).resolves.toMatchObject({ isOnboarded: false });
    expect(received).toHaveBeenCalledWith('kakao', { idToken: 'kakao_id_tok' });
    expect(getSessionToken()).toBe('at_1');
  });

  it('google 은 idToken 을 ?provider=google 로 교환한다', async () => {
    const received = vi.fn();
    server.use(
      http.post(ID_TOKEN_ENDPOINT, async ({ request }) => {
        received(new URL(request.url).searchParams.get('provider'), await request.json());
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    );
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('google');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'g_id_tok' });

    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(received).toHaveBeenCalledWith('google', { idToken: 'g_id_tok' });
  });

  it('naver 는 accessToken 을 /oauth/android/naver 로 보내고 /oauth/android 는 부르지 않는다', async () => {
    const receivedNaver = vi.fn();
    const receivedIdToken = vi.fn();
    server.use(
      http.post(NAVER_ENDPOINT, async ({ request }) => {
        receivedNaver(await request.json());
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
      http.post(ID_TOKEN_ENDPOINT, () => {
        receivedIdToken();
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    );
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('naver');
    await resolveNativeLogin({ tokenType: 'accessToken', token: 'nv_at' });

    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(receivedNaver).toHaveBeenCalledWith({ accessToken: 'nv_at' });
    expect(receivedIdToken).not.toHaveBeenCalled();
  });

  it('naver 에 idToken 이 오면(계약 위반) NATIVE_ERROR 로 실패하고 백엔드를 부르지 않는다', async () => {
    const received = vi.fn();
    server.use(
      http.post(NAVER_ENDPOINT, () => {
        received();
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
      http.post(ID_TOKEN_ENDPOINT, () => {
        received();
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    );
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('naver');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'x' });

    await expect(pending).rejects.toMatchObject({ name: 'BridgeError', code: 'NATIVE_ERROR' });
    expect(received).not.toHaveBeenCalled();
    expect(getSessionToken()).toBeNull();
  });
});
