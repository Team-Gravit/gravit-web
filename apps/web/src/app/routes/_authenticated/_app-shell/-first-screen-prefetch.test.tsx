import type { PropsWithChildren } from 'react';

import { describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { useChapters, useRecentLearning, useWeeklyRecord } from '@/entities/learning';

import { Route as LearningRoute } from './learning.index';
import { Route as MainRoute } from './main';

// REF-062 — 첫 화면 쿼리를 라우트 loader에서 미리 요청한다.
// 화면 컴포넌트를 그리지 않고 loader만 실행해 요청 출발 · 중복 · 실패 처리를 본다.

const MAIN_PAGE_ENDPOINTS = [
  'profile',
  'league',
  'weekly-record',
  'mission',
  'units',
  'learning',
] as const;

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function runLoader(route: { options: { loader?: unknown } }, queryClient: QueryClient) {
  const loader = route.options.loader as (options: {
    context: { queryClient: QueryClient };
  }) => unknown;
  return loader({ context: { queryClient } });
}

function wrapperFor(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

/** 경로별 요청 횟수를 세고, 지정한 응답을 돌려준다. */
function countRequests(path: string, respond: () => Response) {
  const requests = { count: 0 };
  server.use(
    http.get(`*/api/v1/${path}`, () => {
      requests.count += 1;
      return respond();
    }),
  );
  return requests;
}

describe('/learning loader', () => {
  it('화면을 그리기 전에 챕터 목록 요청을 출발시키고, 응답을 기다리지 않는다 (AC-1)', async () => {
    const chapters = countRequests('chapters', () => HttpResponse.json([]));
    const queryClient = createQueryClient();

    const result = runLoader(LearningRoute, queryClient);

    expect(result).toBeUndefined();
    await waitFor(() => expect(chapters.count).toBe(1));
  });

  it('이어서 화면의 훅이 같은 쿼리를 쓰면 요청은 한 번만 나간다 (AC-3)', async () => {
    const chapters = countRequests('chapters', () => HttpResponse.json([]));
    const queryClient = createQueryClient();

    runLoader(LearningRoute, queryClient);
    const { result } = renderHook(() => useChapters(), { wrapper: wrapperFor(queryClient) });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(chapters.count).toBe(1);
  });

  it('미리 요청이 실패해도 loader는 던지지 않고, 훅은 오류 상태가 된다 (AC-4)', async () => {
    countRequests('chapters', () => new HttpResponse(null, { status: 500 }));
    const queryClient = createQueryClient();

    expect(() => runLoader(LearningRoute, queryClient)).not.toThrow();
    const { result } = renderHook(() => useChapters(), { wrapper: wrapperFor(queryClient) });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('/main loader', () => {
  it('첫 화면 쿼리 6개를 화면을 그리기 전에 출발시킨다 (AC-2)', async () => {
    const counters = MAIN_PAGE_ENDPOINTS.map((path) =>
      countRequests(`main-pages/${path}`, () => HttpResponse.json({})),
    );
    const queryClient = createQueryClient();

    runLoader(MainRoute, queryClient);

    await waitFor(() => expect(counters.map((c) => c.count)).toEqual([1, 1, 1, 1, 1, 1]));
  });

  it('학습 기록 · 최근 학습이 404면 null을 캐시해 훅이 빈 상태를 받는다 (AC-5)', async () => {
    for (const path of MAIN_PAGE_ENDPOINTS) {
      countRequests(`main-pages/${path}`, () => HttpResponse.json({}));
    }
    const weekly = countRequests(
      'main-pages/weekly-record',
      () => new HttpResponse(null, { status: 404 }),
    );
    const recent = countRequests(
      'main-pages/learning',
      () => new HttpResponse(null, { status: 404 }),
    );
    const queryClient = createQueryClient();

    runLoader(MainRoute, queryClient);
    const wrapper = wrapperFor(queryClient);
    const weeklyHook = renderHook(() => useWeeklyRecord(), { wrapper });
    const recentHook = renderHook(() => useRecentLearning(), { wrapper });

    await waitFor(() => expect(weeklyHook.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(recentHook.result.current.isSuccess).toBe(true));
    expect(weeklyHook.result.current.data).toBeNull();
    expect(recentHook.result.current.data).toBeNull();
    expect(weekly.count).toBe(1);
    expect(recent.count).toBe(1);
  });
});
