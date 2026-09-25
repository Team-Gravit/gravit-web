import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import {
  getGetLessonResultQueryKey,
  getGetAllLessonInUnitQueryKey,
} from '@/shared/api/generated/lesson-api/lesson-api';
import { getGetAllUnitInChapterQueryKey } from '@/shared/api/generated/unit-api/unit-api';
import { getGetMyLeagueWithProfileQueryKey } from '@/shared/api/generated/userleague-api/userleague-api';
import {
  getChaptersQueryKey,
  getRecentLearningQueryKey,
  getRecommendedUnitsQueryKey,
  getWeeklyRecordQueryKey,
} from '@/entities/learning';
import { getDailyMissionQueryKey } from '@/entities/mission';
import { getLeagueSummaryQueryKey, LEAGUE_RANKING_QUERY_KEY } from '@/entities/league';
import { getUserProfileQueryKey } from '@/entities/user';

import { useSubmitLesson } from './use-submit-lesson';

const SUBMIT_URL = '*/api/v1/lessons/results';
const RESULT_URL = '*/api/v1/lessons/results/345';

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useSubmitLesson', () => {
  it('onSuccess가 비동기 작업을 반환하면 끝날 때까지 isPending을 유지한다', async () => {
    server.use(
      http.post(SUBMIT_URL, () =>
        HttpResponse.json({ lessonSubmissionId: 345, isLevelUp: false, isLeaguePromoted: false }),
      ),
      http.get(RESULT_URL, () => HttpResponse.json({})),
    );

    let finishNavigation!: () => void;
    const navigationFinished = new Promise<void>((resolve) => {
      finishNavigation = resolve;
    });
    const onSuccess = vi.fn(() => navigationFinished);
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useSubmitLesson({ onSuccess }), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.submit({
        lessonId: 7,
        problems: [],
        answersByProblemId: {},
        learningTime: 10,
      });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    expect(result.current.isPending).toBe(true);

    await act(async () => {
      finishNavigation();
      await navigationFinished;
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it('제출에 성공하면 결과를 캐시하고 제출에 영향받는 조회를 무효화한다', async () => {
    server.use(
      http.post(SUBMIT_URL, () =>
        HttpResponse.json({ lessonSubmissionId: 345, isLevelUp: false, isLeaguePromoted: false }),
      ),
      http.get(RESULT_URL, () => HttpResponse.json({ accuracy: 100 })),
    );

    const queryClient = new QueryClient();
    const affectedQueryKeys = [
      getGetAllLessonInUnitQueryKey(3),
      getGetAllUnitInChapterQueryKey(2),
      getChaptersQueryKey(),
      getRecentLearningQueryKey(),
      getRecommendedUnitsQueryKey(),
      getWeeklyRecordQueryKey(),
      getDailyMissionQueryKey(),
      getLeagueSummaryQueryKey(),
      getUserProfileQueryKey(),
      getGetMyLeagueWithProfileQueryKey(),
      [...LEAGUE_RANKING_QUERY_KEY, 'me'],
      [...LEAGUE_RANKING_QUERY_KEY, 'tier', 1],
    ];
    const unrelatedQueryKey = ['unrelated'];

    affectedQueryKeys.forEach((queryKey) => queryClient.setQueryData(queryKey, {}));
    queryClient.setQueryData(unrelatedQueryKey, {});

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useSubmitLesson({ onSuccess }), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.submit({
        lessonId: 7,
        problems: [],
        answersByProblemId: {},
        learningTime: 10,
      });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());

    affectedQueryKeys.forEach((queryKey) => {
      expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(true);
    });
    expect(queryClient.getQueryState(unrelatedQueryKey)?.isInvalidated).toBe(false);
    expect(queryClient.getQueryData(getGetLessonResultQueryKey(345))).toEqual({ accuracy: 100 });
    expect(queryClient.getQueryState(getGetLessonResultQueryKey(345))?.isInvalidated).toBe(false);
  });
});
