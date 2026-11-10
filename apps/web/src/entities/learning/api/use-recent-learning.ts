import { queryOptions, useQuery } from '@tanstack/react-query';

import { nullIfNotFound } from '@/shared/api';
import {
  getGetLearningQueryKey,
  getLearning,
} from '@/shared/api/generated/mainpage-api/mainpage-api';

import { toRecentLearning, type RecentLearning } from '../model/recent-learning';

/**
 * 최근 학습 쿼리 옵션. 학습 기록이 없다는 404 응답을 `null`로 캐시한다.
 * 훅과 라우트 미리 요청이 같은 조회 함수를 써야 같은 키에 다른 결과가 캐시되지 않는다.
 */
export function getRecentLearningQueryOptions() {
  return queryOptions({
    queryKey: getGetLearningQueryKey(),
    queryFn: ({ signal }) => nullIfNotFound(() => getLearning(undefined, signal)),
  });
}

/** 학습 기록이 없다는 404 응답을 `data: null`로 노출한다. */
export function useRecentLearning() {
  return useQuery({
    ...getRecentLearningQueryOptions(),
    select: (response): RecentLearning | null =>
      response === null ? null : toRecentLearning(response),
  });
}
