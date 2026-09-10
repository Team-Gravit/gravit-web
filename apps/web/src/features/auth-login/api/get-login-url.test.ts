import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { getLoginUrl } from './get-login-url';

const LOGIN_URL_ENDPOINT = '*/api/v1/oauth/login-url/google';
const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/auth';

/** 인가 URL 요청이 실어 보낸 dest 를 돌려준다. */
function captureDest(): { read: () => string | null } {
  let dest: string | null = null;

  server.use(
    http.get(LOGIN_URL_ENDPOINT, ({ request }) => {
      dest = new URL(request.url).searchParams.get('dest');
      return HttpResponse.json({ loginUrl: AUTHORIZE_URL });
    }),
  );

  return { read: () => dest };
}

beforeEach(() => {
  vi.stubEnv('VITE_OAUTH_DEST', 'local');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getLoginUrl', () => {
  it("VITE_OAUTH_DEST 가 'dev' 면 요청의 dest 쿼리 파라미터가 'dev' 다", async () => {
    vi.stubEnv('VITE_OAUTH_DEST', 'dev');
    const captured = captureDest();

    await getLoginUrl('google');

    expect(captured.read()).toBe('dev');
  });

  it("VITE_OAUTH_DEST 가 'local' 이면 dest 가 'local' 이다", async () => {
    const captured = captureDest();

    await getLoginUrl('google');

    expect(captured.read()).toBe('local');
  });

  it('응답의 loginUrl 을 반환한다', async () => {
    server.use(http.get(LOGIN_URL_ENDPOINT, () => HttpResponse.json({ loginUrl: AUTHORIZE_URL })));

    await expect(getLoginUrl('google')).resolves.toBe(AUTHORIZE_URL);
  });
});
