import { useQuery } from '@tanstack/react-query';

import { nullIfNotFound } from '@/shared/api';
import {
  getGetLearningQueryOptions,
  getLearning,
} from '@/shared/api/generated/mainpage-api/mainpage-api';

import { toRecentLearning, type RecentLearning } from '../model/recent-learning';

/** 학습 기록이 없다는 404 응답을 `data: null`로 노출한다. */
export function useRecentLearning() {
  const { queryKey } = getGetLearningQueryOptions();

  return useQuery({
    queryKey,
    queryFn: ({ signal }) => nullIfNotFound(() => getLearning(undefined, signal)),
    select: (response): RecentLearning | null =>
      response === null ? null : toRecentLearning(response),
  });
}
