import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import {
  failFromNative,
  installNativeBridgeStub,
  respondFromNative,
  uninstallNativeBridgeStub,
  type NativeBridgeStub,
} from '@/shared/api/mocks/native-bridge';
import { server } from '@/shared/api/mocks/server';
import { toast } from '@/shared/ui/toast';

import { SocialLoginButton } from './social-login-button';

vi.mock('@/shared/ui/toast', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui/toast')>();

  return { ...actual, toast: vi.fn() };
});

const KAKAO_LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/kakao';
const ID_TOKEN_ENDPOINT = '*/api/v1/oauth/ios';
const AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize?client_id=test';
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

const originalLocation = window.location;
const ORIGINAL_HREF = originalLocation.href;
let assignedHref = ORIGINAL_HREF;

beforeEach(() => {
  // 이동 전에는 실제 주소를 유지한다. 빈 값이면 상대 URL 해석이 `Invalid base URL`로 터진다.
  assignedHref = ORIGINAL_HREF;
  // jsdom은 실제 이동을 구현하지 않으므로 대입된 값만 관찰한다.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      origin: originalLocation.origin,
      protocol: originalLocation.protocol,
      host: originalLocation.host,
      pathname: originalLocation.pathname,
      get href() {
        return assignedHref;
      },
      set href(value: string) {
        assignedHref = value;
      },
    },
  });
});

afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

describe('SocialLoginButton', () => {
  it('provider 에 해당하는 레이블을 가진 버튼을 렌더한다', () => {
    render(<SocialLoginButton provider="kakao" />, { wrapper: Wrapper });

    expect(screen.getByRole('button', { name: '카카오로 시작하기' })).toBeInTheDocument();
  });

  it('응답이 오기 전에 3회 클릭해도 인가 URL 조회는 1회만 나간다', async () => {
    let requestCount = 0;
    // 응답을 붙잡아 두어 pending 구간을 만든다. 풀어 주기 전까지 버튼은 잠겨 있어야 한다.
    let releaseResponse: () => void = () => {};
    const responseHeld = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    server.use(
      http.get(KAKAO_LOGIN_URL_ENDPOINT, async () => {
        requestCount += 1;
        await responseHeld;
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL, state: 'st_1' });
      }),
    );
    render(<SocialLoginButton provider="kakao" />, { wrapper: Wrapper });
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    await userEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    await userEvent.click(button);
    await userEvent.click(button);

    expect(requestCount).toBe(1);

    releaseResponse();
    await waitFor(() => expect(assignedHref).toBe(AUTHORIZE_URL));
  });

  it('클릭하면 해당 provider 의 인가 URL 조회가 1회 나가고 그 주소로 이동한다', async () => {
    let requestCount = 0;
    server.use(
      http.get(KAKAO_LOGIN_URL_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL, state: 'st_1' });
      }),
    );
    render(<SocialLoginButton provider="kakao" />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));

    await waitFor(() => expect(assignedHref).toBe(AUTHORIZE_URL));
    expect(requestCount).toBe(1);
  });

  it('인가 URL 조회가 실패하면 버튼이 풀리고 onLoginError 가 1회 호출된다', async () => {
    server.use(http.get(KAKAO_LOGIN_URL_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
    const onLoginError = vi.fn();
    render(<SocialLoginButton provider="kakao" onLoginError={onLoginError} />, {
      wrapper: Wrapper,
    });
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    await userEvent.click(button);

    await waitFor(() => expect(onLoginError).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(button).toBeEnabled());
    expect(assignedHref).toBe(ORIGINAL_HREF);
  });
});

describe('SocialLoginButton — 앱 환경', () => {
  let bridge: NativeBridgeStub;

  beforeEach(() => {
    bridge = installNativeBridgeStub({ platform: 'ios' });
  });

  afterEach(() => {
    uninstallNativeBridgeStub();
  });

  /** 클릭 후 AUTH_LOGIN 요청이 나갈 때까지 기다리고 그 id 를 돌려준다. */
  async function clickAndReadRequestId() {
    await userEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));
    await waitFor(() => expect(bridge.postMessage).toHaveBeenCalledTimes(1));

    const request = bridge.readLastRequest();
    expect(request).toMatchObject({ type: 'AUTH_LOGIN', payload: { provider: 'kakao' } });

    return request.id;
  }

  it('클릭하면 AUTH_LOGIN 을 요청하고, 교환이 끝나면 onLoginSuccess 에 응답을 넘긴다', async () => {
    server.use(http.post(ID_TOKEN_ENDPOINT, () => HttpResponse.json(LOGIN_RESPONSE)));
    const onLoginSuccess = vi.fn();
    render(<SocialLoginButton provider="kakao" onLoginSuccess={onLoginSuccess} />, {
      wrapper: Wrapper,
    });

    const id = await clickAndReadRequestId();
    respondFromNative(id, { tokenType: 'idToken', token: 'kakao_id_tok' });

    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
    expect(onLoginSuccess).toHaveBeenCalledWith(expect.objectContaining({ isOnboarded: false }));
    expect(screen.getByRole('button', { name: '카카오로 시작하기' })).toBeEnabled();
  });

  it('CANCELLED 로 실패하면 버튼이 풀리고 onLoginError 와 백엔드 요청은 없다', async () => {
    let requestCount = 0;
    server.use(
      http.post(ID_TOKEN_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    );
    const onLoginError = vi.fn();
    render(<SocialLoginButton provider="kakao" onLoginError={onLoginError} />, {
      wrapper: Wrapper,
    });
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    const id = await clickAndReadRequestId();
    expect(button).toBeDisabled();
    failFromNative(id, 'CANCELLED');

    await waitFor(() => expect(button).toBeEnabled());
    expect(onLoginError).not.toHaveBeenCalled();
    expect(requestCount).toBe(0);
  });

  it('UNSUPPORTED 로 실패하면 업데이트 토스트가 1회 뜨고 웹 인가 페이지로 이동하지 않는다', async () => {
    vi.mocked(toast).mockClear();
    let loginUrlRequestCount = 0;
    server.use(
      http.get(KAKAO_LOGIN_URL_ENDPOINT, () => {
        loginUrlRequestCount += 1;
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL, state: 'st_1' });
      }),
    );
    const onLoginError = vi.fn();
    render(<SocialLoginButton provider="kakao" onLoginError={onLoginError} />, {
      wrapper: Wrapper,
    });
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    const id = await clickAndReadRequestId();
    failFromNative(id, 'UNSUPPORTED', 'unknown type');

    await waitFor(() => expect(toast).toHaveBeenCalledTimes(1));
    expect(toast).toHaveBeenCalledWith(
      '해당 로그인을 사용할 수 없습니다. 앱을 업데이트 해주세요.',
      {
        position: 'noneTabBottom',
      },
    );
    await waitFor(() => expect(button).toBeEnabled());
    expect(loginUrlRequestCount).toBe(0);
    expect(assignedHref).toBe(ORIGINAL_HREF);
    expect(onLoginError).not.toHaveBeenCalled();
  });

  it('TIMEOUT 등 그 외 실패는 버튼이 풀리고 onLoginError 로 전달된다', async () => {
    vi.mocked(toast).mockClear();
    const onLoginError = vi.fn();
    render(<SocialLoginButton provider="kakao" onLoginError={onLoginError} />, {
      wrapper: Wrapper,
    });
    const button = screen.getByRole('button', { name: '카카오로 시작하기' });

    const id = await clickAndReadRequestId();
    failFromNative(id, 'TIMEOUT');

    await waitFor(() => expect(button).toBeEnabled());
    expect(onLoginError).toHaveBeenCalledTimes(1);
    expect(onLoginError.mock.calls[0][0]).toMatchObject({ code: 'TIMEOUT' });
    expect(assignedHref).toBe(ORIGINAL_HREF);
    expect(toast).not.toHaveBeenCalled();
  });

  it('브라우저 환경이면 postMessage 없이 인가 URL 조회가 1회 나간다', async () => {
    uninstallNativeBridgeStub();
    let requestCount = 0;
    server.use(
      http.get(KAKAO_LOGIN_URL_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL, state: 'st_1' });
      }),
    );
    render(<SocialLoginButton provider="kakao" />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));

    await waitFor(() => expect(assignedHref).toBe(AUTHORIZE_URL));
    expect(requestCount).toBe(1);
    expect(bridge.postMessage).not.toHaveBeenCalled();
  });
});

describe('SocialLoginButton — Apple', () => {
  const APPLE_IOS_ENDPOINT = '*/api/v1/oauth/ios/apple';
  const APPLE_WEB_ENDPOINT = '*/api/v1/oauth/apple';
  const APPLE_LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/apple';

  it('앱 환경에서 클릭하면 apple 로 AUTH_LOGIN 을 요청하고 authorizationCode 를 iOS 엔드포인트로 교환한다', async () => {
    const bridge = installNativeBridgeStub({ platform: 'ios' });
    const received = vi.fn();
    server.use(
      http.post(APPLE_IOS_ENDPOINT, async ({ request }) => {
        received(await request.json());
        return HttpResponse.json(LOGIN_RESPONSE);
      }),
    );
    const onLoginSuccess = vi.fn();
    render(<SocialLoginButton provider="apple" onLoginSuccess={onLoginSuccess} />, {
      wrapper: Wrapper,
    });

    await userEvent.click(screen.getByRole('button', { name: 'Apple로 시작하기' }));
    await waitFor(() => expect(bridge.postMessage).toHaveBeenCalledTimes(1));
    const request = bridge.readLastRequest();
    expect(request).toMatchObject({ type: 'AUTH_LOGIN', payload: { provider: 'apple' } });
    respondFromNative(request.id, { tokenType: 'authorizationCode', token: 'apple_code' });

    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
    expect(received).toHaveBeenCalledWith({ code: 'apple_code' });
    uninstallNativeBridgeStub();
  });

  describe('브라우저 환경', () => {
    const signIn = vi.fn();

    beforeEach(() => {
      vi.stubEnv('VITE_APPLE_CLIENT_ID', 'kr.example.web');
      window.AppleID = { auth: { init: vi.fn(), signIn } };
      server.use(
        http.get(APPLE_LOGIN_URL_ENDPOINT, () =>
          HttpResponse.json({ loginUrl: AUTHORIZE_URL, state: 'st_apple' }),
        ),
      );
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      delete window.AppleID;
      signIn.mockReset();
    });

    it('클릭하면 state 를 받아 Apple 팝업에 넣고, code 와 state 를 웹 엔드포인트로 교환한다 (AC-6)', async () => {
      const received = vi.fn();
      let loginUrlRequestCount = 0;
      signIn.mockResolvedValue({ authorization: { code: 'apple_web_code', state: 'st_apple' } });
      server.use(
        http.post(APPLE_WEB_ENDPOINT, async ({ request }) => {
          received(new URL(request.url).searchParams.get('dest'), await request.json());
          return HttpResponse.json(LOGIN_RESPONSE);
        }),
        http.get(APPLE_LOGIN_URL_ENDPOINT, () => {
          loginUrlRequestCount += 1;
          return HttpResponse.json({ loginUrl: AUTHORIZE_URL, state: 'st_apple' });
        }),
      );
      const onLoginSuccess = vi.fn();
      render(<SocialLoginButton provider="apple" onLoginSuccess={onLoginSuccess} />, {
        wrapper: Wrapper,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Apple로 시작하기' }));

      await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
      expect(received).toHaveBeenCalledWith(expect.any(String), {
        code: 'apple_web_code',
        state: 'st_apple',
      });
      expect(loginUrlRequestCount).toBe(1);
      // 팝업 로그인이라 인가 페이지로 이동하지 않는다.
      expect(assignedHref).toBe(ORIGINAL_HREF);
    });

    it('팝업 응답의 state 가 다르면 교환하지 않고 onLoginError 를 부른다 (AC-6)', async () => {
      let requestCount = 0;
      signIn.mockResolvedValue({ authorization: { code: 'apple_web_code', state: 'st_other' } });
      server.use(
        http.post(APPLE_WEB_ENDPOINT, () => {
          requestCount += 1;
          return HttpResponse.json(LOGIN_RESPONSE);
        }),
      );
      const onLoginError = vi.fn();
      render(<SocialLoginButton provider="apple" onLoginError={onLoginError} />, {
        wrapper: Wrapper,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Apple로 시작하기' }));

      await waitFor(() => expect(onLoginError).toHaveBeenCalledTimes(1));
      expect(requestCount).toBe(0);
    });

    it('팝업을 닫으면 버튼이 풀리고 onLoginError 와 교환 요청은 없다', async () => {
      let requestCount = 0;
      signIn.mockRejectedValue({ error: 'popup_closed_by_user' });
      server.use(
        http.post(APPLE_WEB_ENDPOINT, () => {
          requestCount += 1;
          return HttpResponse.json(LOGIN_RESPONSE);
        }),
      );
      const onLoginError = vi.fn();
      render(<SocialLoginButton provider="apple" onLoginError={onLoginError} />, {
        wrapper: Wrapper,
      });
      const button = screen.getByRole('button', { name: 'Apple로 시작하기' });

      await userEvent.click(button);

      await waitFor(() => expect(signIn).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(button).toBeEnabled());
      expect(onLoginError).not.toHaveBeenCalled();
      expect(requestCount).toBe(0);
    });

    it('교환이 500 이면 onLoginError 가 1회 호출된다', async () => {
      signIn.mockResolvedValue({ authorization: { code: 'apple_web_code', state: 'st_apple' } });
      server.use(http.post(APPLE_WEB_ENDPOINT, () => new HttpResponse(null, { status: 500 })));
      const onLoginError = vi.fn();
      render(<SocialLoginButton provider="apple" onLoginError={onLoginError} />, {
        wrapper: Wrapper,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Apple로 시작하기' }));

      await waitFor(() => expect(onLoginError).toHaveBeenCalledTimes(1));
    });
  });
});
