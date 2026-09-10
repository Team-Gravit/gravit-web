import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { useOauthLogin } from './use-oauth-login';

const LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/google';
const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/auth?client_id=test';

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

describe('useOauthLogin', () => {
  it('provider 의 인가 URL 을 1회 조회하고 그 주소로 이동한다', async () => {
    let requestCount = 0;
    server.use(
      http.get(LOGIN_URL_ENDPOINT, () => {
        requestCount += 1;
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL });
      }),
    );

    const { result } = renderHook(() => useOauthLogin(), { wrapper: Wrapper });

    result.current.mutate('google');

    await waitFor(() => expect(assignedHref).toBe(AUTHORIZE_URL));
    expect(requestCount).toBe(1);
  });
});
