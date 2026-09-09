import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { configureAuth } from './auth-token';
import { AXIOS_INSTANCE } from './axios-instance';
import { server } from './mocks/server';

// baseURL 이 환경변수에 의존하므로 테스트에서는 절대 URL 로 호출해 결과를 고정한다.
const TEST_URL = 'https://api.test.local/ping';

afterEach(() => {
  configureAuth({ readAuthToken: () => null, onUnauthorized: () => {} });
});

describe('요청 인터셉터', () => {
  it('주입된 토큰이 있으면 Authorization 헤더에 Bearer 로 싣는다', async () => {
    configureAuth({ readAuthToken: () => 'tok_abc', onUnauthorized: () => {} });

    let authorization: string | null = null;
    server.use(
      http.get(TEST_URL, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );

    await AXIOS_INSTANCE.get(TEST_URL);

    expect(authorization).toBe('Bearer tok_abc');
  });

  it('주입된 토큰이 없으면 Authorization 헤더 없이 요청이 전송된다', async () => {
    configureAuth({ readAuthToken: () => null, onUnauthorized: () => {} });

    let authorization: string | null = 'not-called';
    server.use(
      http.get(TEST_URL, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );

    await AXIOS_INSTANCE.get(TEST_URL);

    expect(authorization).toBeNull();
  });
});

describe('응답 인터셉터', () => {
  it('401 이면 onUnauthorized 를 1회 호출하고 에러를 전파한다', async () => {
    const onUnauthorized = vi.fn();
    configureAuth({ readAuthToken: () => 'tok_abc', onUnauthorized });

    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 401 })));

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('403 이면 onUnauthorized 를 호출하지 않는다', async () => {
    const onUnauthorized = vi.fn();
    configureAuth({ readAuthToken: () => 'tok_abc', onUnauthorized });

    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 403 })));

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});
