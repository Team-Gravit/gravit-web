import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

const LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/google';
const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/auth';

beforeEach(() => {
  // OAUTH_DEST 는 모듈 평가 시점에 읽히므로, 환경을 바꾸려면 모듈을 다시 불러와야 한다.
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getLoginUrl', () => {
  it("VITE_OAUTH_DEST 가 'dev' 면 요청의 dest 쿼리 파라미터가 'dev' 다", async () => {
    vi.stubEnv('VITE_OAUTH_DEST', 'dev');
    const { getLoginUrl } = await import('./get-login-url');

    let dest: string | null = null;
    server.use(
      http.get(LOGIN_URL_ENDPOINT, ({ request }) => {
        dest = new URL(request.url).searchParams.get('dest');
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL });
      }),
    );

    await getLoginUrl('google');

    expect(dest).toBe('dev');
  });

  it("VITE_OAUTH_DEST 가 'local' 이면 dest 가 'local' 이다", async () => {
    vi.stubEnv('VITE_OAUTH_DEST', 'local');
    const { getLoginUrl } = await import('./get-login-url');

    let dest: string | null = null;
    server.use(
      http.get(LOGIN_URL_ENDPOINT, ({ request }) => {
        dest = new URL(request.url).searchParams.get('dest');
        return HttpResponse.json({ loginUrl: AUTHORIZE_URL });
      }),
    );

    await getLoginUrl('google');

    expect(dest).toBe('local');
  });

  it('응답의 loginUrl 을 반환한다', async () => {
    vi.stubEnv('VITE_OAUTH_DEST', 'local');
    const { getLoginUrl } = await import('./get-login-url');

    server.use(http.get(LOGIN_URL_ENDPOINT, () => HttpResponse.json({ loginUrl: AUTHORIZE_URL })));

    await expect(getLoginUrl('google')).resolves.toBe(AUTHORIZE_URL);
  });
});
