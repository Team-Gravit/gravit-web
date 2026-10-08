import { useQueryClient, type QueryClient } from '@tanstack/react-query';

import {
  getGetLessonResultQueryOptions,
  useSaveLessonSubmission,
} from '@/shared/api/generated/lesson-api/lesson-api';
import type { LessonSubmissionSaveResponse } from '@/shared/api/generated/model';
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

import { toSubmissionBody, type SubmissionInput } from '../model/submission';

const UNIT_LESSONS_PATH_PREFIX = '/api/v1/lessons/';
const LESSON_RESULTS_PATH_PREFIX = '/api/v1/lessons/results/';
const CHAPTER_UNITS_PATH_PREFIX = '/api/v1/units/';

const SUBMISSION_DEPENDENT_QUERY_KEYS = [
  getChaptersQueryKey(),
  getRecentLearningQueryKey(),
  getRecommendedUnitsQueryKey(),
  getWeeklyRecordQueryKey(),
  getDailyMissionQueryKey(),
  getLeagueSummaryQueryKey(),
  getUserProfileQueryKey(),
  getGetMyLeagueWithProfileQueryKey(),
] as const;

export interface UseSubmitLessonOptions {
  onSuccess: (response: LessonSubmissionSaveResponse) => void | Promise<void>;
  onError?: () => void;
}

/**
 * 레슨 답안을 제출하고 결과 조회를 미리 받은 뒤 관련 화면의 캐시를 무효화한다.
 * 결과 조회가 실패해도 제출 성공은 유지하며, 결과 화면에서 조회 오류를 처리한다.
 */
export function useSubmitLesson({ onSuccess, onError }: UseSubmitLessonOptions) {
  const queryClient = useQueryClient();
  const mutation = useSaveLessonSubmission({
    mutation: {
      onSuccess: async (response) => {
        // 생성된 옵션을 사용해야 동일한 queryKey와 queryFn으로 결과를 캐시한다.
        await queryClient.prefetchQuery(
          getGetLessonResultQueryOptions(response.lessonSubmissionId),
        );
        await invalidateSubmissionDependentQueries(queryClient);
        await onSuccess(response);
      },
      onError,
    },
  });

  return {
    ...mutation,
    submit: (input: SubmissionInput) => mutation.mutate({ data: toSubmissionBody(input) }),
  };
}

async function invalidateSubmissionDependentQueries(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    ...SUBMISSION_DEPENDENT_QUERY_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey, exact: true }),
    ),
    queryClient.invalidateQueries({
      // path parameter가 URL 문자열에 포함돼 레슨·유닛 목록은 경로로 묶는다.
      predicate: ({ queryKey }) => {
        const path = queryKey[0];

        return (
          typeof path === 'string' &&
          ((path.startsWith(UNIT_LESSONS_PATH_PREFIX) &&
            !path.startsWith(LESSON_RESULTS_PATH_PREFIX)) ||
            path.startsWith(CHAPTER_UNITS_PATH_PREFIX))
        );
      },
    }),
    queryClient.invalidateQueries({ queryKey: LEAGUE_RANKING_QUERY_KEY }),
  ]);
}
