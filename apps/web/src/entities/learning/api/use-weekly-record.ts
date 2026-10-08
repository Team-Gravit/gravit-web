import { useQuery } from '@tanstack/react-query';

import { nullIfNotFound } from '@/shared/api';
import {
  getGetWeeklyRecordQueryOptions,
  getWeeklyRecord,
} from '@/shared/api/generated/mainpage-api/mainpage-api';

/** 학습 기록이 없다는 404 응답을 `data: null`로 노출한다. */
export function useWeeklyRecord() {
  const { queryKey } = getGetWeeklyRecordQueryOptions();

  return useQuery({
    queryKey,
    queryFn: ({ signal }) => nullIfNotFound(() => getWeeklyRecord(undefined, signal)),
  });
}
