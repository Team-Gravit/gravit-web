import { queryOptions, useQuery } from '@tanstack/react-query';

import { nullIfNotFound } from '@/shared/api';
import {
  getGetWeeklyRecordQueryKey,
  getWeeklyRecord,
} from '@/shared/api/generated/mainpage-api/mainpage-api';

/**
 * 주간 학습 기록 쿼리 옵션. 학습 기록이 없다는 404 응답을 `null`로 캐시한다.
 * 훅과 라우트 미리 요청이 같은 조회 함수를 써야 같은 키에 다른 결과가 캐시되지 않는다.
 */
export function getWeeklyRecordQueryOptions() {
  return queryOptions({
    queryKey: getGetWeeklyRecordQueryKey(),
    queryFn: ({ signal }) => nullIfNotFound(() => getWeeklyRecord(undefined, signal)),
  });
}

/** 학습 기록이 없다는 404 응답을 `data: null`로 노출한다. */
export function useWeeklyRecord() {
  return useQuery(getWeeklyRecordQueryOptions());
}
