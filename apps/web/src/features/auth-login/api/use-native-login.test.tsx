import type { PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { clearSession, getSessionToken } from '@/entities/auth';
import {
  failFromNative,
  installNativeBridgeStub,
  respondFromNative,
  uninstallNativeBridgeStub,
  type NativeBridgeStub,
} from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';

import { useNativeLogin } from './use-native-login';

const IOS_ID_TOKEN_ENDPOINT = '*/api/v1/oauth/ios';
const IOS_NAVER_ENDPOINT = '*/api/v1/oauth/ios/naver';
const IOS_APPLE_ENDPOINT = '*/api/v1/oauth/ios/apple';
const ANDROID_ID_TOKEN_ENDPOINT = '*/api/v1/oauth/android';
const ANDROID_NAVER_ENDPOINT = '*/api/v1/oauth/android/naver';

const ALL_ENDPOINTS = [
  IOS_ID_TOKEN_ENDPOINT,
  IOS_NAVER_ENDPOINT,
  IOS_APPLE_ENDPOINT,
  ANDROID_ID_TOKEN_ENDPOINT,
  ANDROID_NAVER_ENDPOINT,
];

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

interface ReceivedRequest {
  endpoint: string;
  provider: string | null;
  body: unknown;
}

/** 모든 앱 로그인 경로를 등록하고, 어느 경로가 무엇을 받았는지 기록한다. */
function recordLoginRequests() {
  const received = vi.fn<(request: ReceivedRequest) => void>();

  server.use(
    ...ALL_ENDPOINTS.map((endpoint) =>
      http.post(endpoint, async ({ request }) => {
        received({
          endpoint,
          provider: new URL(request.url).searchParams.get('provider'),
          body: await request.json(),
        });
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    ),
  );

  return received;
}

/** 네이티브가 SDK 토큰을 돌려준 것처럼 응답한다. 요청이 나갈 때까지 기다린다. */
async function resolveNativeLogin(token: {
  tokenType: 'idToken' | 'accessToken' | 'authorizationCode';
  token: string;
}) {
  await waitFor(() => expect(bridge.postMessage).toHaveBeenCalledTimes(1));
  respondFromNative(bridge.readLastRequest().id, token);
}

afterEach(() => {
  uninstallNativeBridgeStub();
  clearSession();
});

describe('useNativeLogin — iOS 앱', () => {
  it('kakao 는 APP_INFO 다음 AUTH_LOGIN 을 보내고 idToken 을 /oauth/ios?provider=kakao 로 교환한다', async () => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('kakao');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'kakao_id_tok' });

    expect(bridge.readAppInfoRequestCount()).toBe(1);
    expect(bridge.readLastRequest()).toMatchObject({
      type: 'AUTH_LOGIN',
      payload: { provider: 'kakao' },
    });
    await expect(pending).resolves.toMatchObject({ isOnboarded: false });
    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith({
      endpoint: IOS_ID_TOKEN_ENDPOINT,
      provider: 'kakao',
      body: { idToken: 'kakao_id_tok' },
    });
    expect(getSessionToken()).toBe('at_1');
  });

  it('google 은 idToken 을 /oauth/ios?provider=google 로 교환한다', async () => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('google');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'g_id_tok' });

    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith({
      endpoint: IOS_ID_TOKEN_ENDPOINT,
      provider: 'google',
      body: { idToken: 'g_id_tok' },
    });
  });

  it('naver 는 accessToken 을 /oauth/ios/naver 로 보낸다', async () => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('naver');
    await resolveNativeLogin({ tokenType: 'accessToken', token: 'nv_at' });

    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith({
      endpoint: IOS_NAVER_ENDPOINT,
      provider: null,
      body: { accessToken: 'nv_at' },
    });
  });

  it('apple 은 authorizationCode 를 { code } 로 /oauth/ios/apple 에 보내고 세션을 만든다', async () => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('apple');
    await resolveNativeLogin({ tokenType: 'authorizationCode', token: 'apple_code' });

    expect(bridge.readLastRequest()).toMatchObject({
      type: 'AUTH_LOGIN',
      payload: { provider: 'apple' },
    });
    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith({
      endpoint: IOS_APPLE_ENDPOINT,
      provider: null,
      body: { code: 'apple_code' },
    });
    expect(getSessionToken()).toBe('at_1');
  });

  it('apple 에 idToken 이 오면(계약 위반) NATIVE_ERROR 로 실패하고 백엔드를 부르지 않는다', async () => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('apple');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'x' });

    await expect(pending).rejects.toMatchObject({ name: 'BridgeError', code: 'NATIVE_ERROR' });
    expect(received).not.toHaveBeenCalled();
    expect(getSessionToken()).toBeNull();
  });

  it('naver 에 idToken 이 오면(계약 위반) NATIVE_ERROR 로 실패하고 백엔드를 부르지 않는다', async () => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('naver');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'x' });

    await expect(pending).rejects.toMatchObject({ name: 'BridgeError', code: 'NATIVE_ERROR' });
    expect(received).not.toHaveBeenCalled();
    expect(getSessionToken()).toBeNull();
  });
});

describe('useNativeLogin — Android 앱', () => {
  it('kakao 는 idToken 을 /oauth/android?provider=kakao 로 교환한다', async () => {
    bridge = installNativeBridgeStub({ platform: 'android' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('kakao');
    await resolveNativeLogin({ tokenType: 'idToken', token: 'kakao_id_tok' });

    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith({
      endpoint: ANDROID_ID_TOKEN_ENDPOINT,
      provider: 'kakao',
      body: { idToken: 'kakao_id_tok' },
    });
  });

  it('naver 는 accessToken 을 /oauth/android/naver 로 보낸다', async () => {
    bridge = installNativeBridgeStub({ platform: 'android' });
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('naver');
    await resolveNativeLogin({ tokenType: 'accessToken', token: 'nv_at' });

    await expect(pending).resolves.toMatchObject(LOGIN_RESPONSE);
    expect(received).toHaveBeenCalledOnce();
    expect(received).toHaveBeenCalledWith({
      endpoint: ANDROID_NAVER_ENDPOINT,
      provider: null,
      body: { accessToken: 'nv_at' },
    });
  });
});

describe('useNativeLogin — 기기 확인 실패', () => {
  it('APP_INFO 가 실패하면 AUTH_LOGIN 을 보내지 않고 그 오류로 실패한다', async () => {
    bridge = installNativeBridgeStub();
    const received = recordLoginRequests();
    const { result } = renderHook(() => useNativeLogin(), { wrapper: Wrapper });

    const pending = result.current.mutateAsync('kakao');
    await waitFor(() => expect(bridge.postMessage).toHaveBeenCalledTimes(1));
    expect(bridge.readLastRequest()).toMatchObject({ type: 'APP_INFO' });
    failFromNative(bridge.readLastRequest().id, 'NATIVE_ERROR');

    await expect(pending).rejects.toMatchObject({ name: 'BridgeError', code: 'NATIVE_ERROR' });
    expect(bridge.postMessage).toHaveBeenCalledTimes(1);
    expect(received).not.toHaveBeenCalled();
    expect(getSessionToken()).toBeNull();
  });
});
