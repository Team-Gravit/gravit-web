import { describe, expect, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { isRedirect } from '@tanstack/react-router';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { Route } from './index';
import type { RouterContext } from '../../__root';

const USER_ENDPOINT = '*/api/v1/users';

/** 온보딩 진입 가드의 redirect 여부를 확인한다. */
async function runGuard(): Promise<string | null> {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const guard = Route.options.beforeLoad as unknown as (opts: {
    context: RouterContext;
  }) => Promise<void>;

  try {
    await guard({ context: { queryClient } });
    return null;
  } catch (error) {
    // redirect 목적지는 error.options.to에 담긴다.
    if (isRedirect(error)) {
      return String(error.options.to);
    }

    throw error;
  }
}

describe('/onboarding 진입 가드', () => {
  it('이미 가입을 마친 사용자는 /main 으로 보낸다', async () => {
    server.use(http.get(USER_ENDPOINT, () => HttpResponse.json({ userId: 1, isOnboarded: true })));

    await expect(runGuard()).resolves.toBe('/main');
  });

  it('아직 가입하지 않은 사용자는 들여보낸다', async () => {
    server.use(http.get(USER_ENDPOINT, () => HttpResponse.json({ userId: 1, isOnboarded: false })));

    await expect(runGuard()).resolves.toBeNull();
  });

  it('사용자 조회가 실패해도 들여보낸다', async () => {
    // 사용자 조회 실패 시에도 온보딩 화면을 연다.
    server.use(
      http.get(USER_ENDPOINT, () => HttpResponse.json({ error: 'USER_404' }, { status: 404 })),
    );

    await expect(runGuard()).resolves.toBeNull();
  });
});
