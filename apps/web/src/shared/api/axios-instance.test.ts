import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { configureAuth, type AuthConfig } from './auth-token';
import { AXIOS_INSTANCE } from './axios-instance';
import { server } from './mocks/server';

// baseURL 이 환경변수에 의존하므로 테스트에서는 절대 URL 로 호출해 결과를 고정한다.
const TEST_URL = 'https://api.test.local/ping';
// 재발급은 baseURL 을 거쳐 나가므로 경로만 맞춘다.
const REISSUE_URL = '*/api/v1/auth/reissue';

const NO_SESSION: AuthConfig = {
  readAuthToken: () => null,
  readRefreshToken: () => null,
  onUnauthorized: () => {},
  onTokenRefreshed: () => {},
};

function configure(overrides: Partial<AuthConfig> = {}): void {
  configureAuth({ ...NO_SESSION, ...overrides });
}

/** 만료된 세션. 첫 요청은 401 을 받고 재발급 경로를 탄다. */
function configureExpiredSession(overrides: Partial<AuthConfig> = {}): void {
  configure({ readAuthToken: () => 'tok_old', readRefreshToken: () => 'ref_1', ...overrides });
}

afterEach(() => {
  configure();
});

describe('요청 인터셉터', () => {
  it('주입된 토큰이 있으면 Authorization 헤더에 Bearer 로 싣는다', async () => {
    configure({ readAuthToken: () => 'tok_abc' });

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
    configure();

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
  it('refreshToken 이 없으면 401 에서 onUnauthorized 를 1회 호출하고 에러를 전파한다', async () => {
    const onUnauthorized = vi.fn();
    configure({ readAuthToken: () => 'tok_abc', onUnauthorized });

    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 401 })));

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('403 이면 onUnauthorized 를 호출하지 않는다', async () => {
    const onUnauthorized = vi.fn();
    configure({ readAuthToken: () => 'tok_abc', onUnauthorized });

    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 403 })));

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});

describe('토큰 갱신', () => {
  it('401 이면 재발급 후 원요청을 새 토큰으로 1회 재시도한다', async () => {
    const onTokenRefreshed = vi.fn();
    configureExpiredSession({ onTokenRefreshed });

    let reissueCount = 0;
    let pingCount = 0;
    server.use(
      http.post(REISSUE_URL, () => {
        reissueCount += 1;
        return HttpResponse.json({ accessToken: 'tok_new' });
      }),
      http.get(TEST_URL, ({ request }) => {
        pingCount += 1;

        if (pingCount === 1) {
          return new HttpResponse(null, { status: 401 });
        }

        return HttpResponse.json({ authorization: request.headers.get('Authorization') });
      }),
    );

    const response = await AXIOS_INSTANCE.get<{ authorization: string | null }>(TEST_URL);

    expect(reissueCount).toBe(1);
    expect(pingCount).toBe(2);
    expect(response.data.authorization).toBe('Bearer tok_new');
    expect(onTokenRefreshed).toHaveBeenCalledWith('tok_new');
  });

  it('재시도한 요청이 다시 401 이면 재발급을 다시 호출하지 않고 에러를 전파한다', async () => {
    const onUnauthorized = vi.fn();
    configureExpiredSession({ onUnauthorized });

    let reissueCount = 0;
    server.use(
      http.post(REISSUE_URL, () => {
        reissueCount += 1;
        return HttpResponse.json({ accessToken: 'tok_new' });
      }),
      http.get(TEST_URL, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(reissueCount).toBe(1);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('동시에 401 이 3건이어도 재발급은 1회만 나가고 모두 같은 토큰으로 재시도된다', async () => {
    configureExpiredSession();

    let reissueCount = 0;
    const failedOnce = new Set<string>();
    const retriedWith: (string | null)[] = [];
    server.use(
      http.post(REISSUE_URL, () => {
        reissueCount += 1;
        return HttpResponse.json({ accessToken: 'tok_new' });
      }),
      http.get('https://api.test.local/concurrent/:id', ({ params, request }) => {
        const id = String(params.id);

        if (!failedOnce.has(id)) {
          failedOnce.add(id);
          return new HttpResponse(null, { status: 401 });
        }

        retriedWith.push(request.headers.get('Authorization'));
        return HttpResponse.json({ ok: true });
      }),
    );

    await Promise.all(
      [1, 2, 3].map((id) => AXIOS_INSTANCE.get(`https://api.test.local/concurrent/${id}`)),
    );

    expect(reissueCount).toBe(1);
    expect(retriedWith).toHaveLength(3);
    expect(retriedWith.every((header) => header === 'Bearer tok_new')).toBe(true);
  });

  it('재시도한 요청이 403 이면 onUnauthorized 를 호출하지 않는다', async () => {
    const onUnauthorized = vi.fn();
    configureExpiredSession({ onUnauthorized });

    let pingCount = 0;
    server.use(
      http.post(REISSUE_URL, () => HttpResponse.json({ accessToken: 'tok_new' })),
      http.get(TEST_URL, () => {
        pingCount += 1;
        return new HttpResponse(null, { status: pingCount === 1 ? 401 : 403 });
      }),
    );

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('재발급이 500 으로 실패하면 onUnauthorized 를 1회 호출한다', async () => {
    const onUnauthorized = vi.fn();
    configureExpiredSession({ onUnauthorized });

    server.use(
      http.post(REISSUE_URL, () => new HttpResponse(null, { status: 500 })),
      http.get(TEST_URL, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('재발급 요청 자체가 401 을 받아도 재발급을 다시 호출하지 않는다', async () => {
    configureExpiredSession();

    let reissueCount = 0;
    server.use(
      http.post(REISSUE_URL, () => {
        reissueCount += 1;
        return new HttpResponse(null, { status: 401 });
      }),
      http.get(TEST_URL, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(AXIOS_INSTANCE.get(TEST_URL)).rejects.toThrow();
    expect(reissueCount).toBe(1);
  });
});
