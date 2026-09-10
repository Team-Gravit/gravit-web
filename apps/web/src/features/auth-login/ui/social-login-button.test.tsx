import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { SocialLoginButton } from './social-login-button';

const KAKAO_LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/kakao';
const AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize?client_id=test';

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
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL });
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
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL });
      }),
    );
    render(<SocialLoginButton provider="kakao" />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));

    await waitFor(() => expect(assignedHref).toBe(AUTHORIZE_URL));
    expect(requestCount).toBe(1);
  });
});
