import { useGetAllLessonInUnit } from '@/shared/api/generated/lesson-api/lesson-api';

import { toUnitLessons, type UnitLessons } from '../model/lesson';

/** 서버 응답을 UnitLessons 모델로 변환해 생성 API의 응답 구조가 화면까지 퍼지지 않게 한다. */
export function useUnitLessons(unitId: number) {
  return useGetAllLessonInUnit<UnitLessons>(unitId, {
    query: { select: toUnitLessons, enabled: Number.isInteger(unitId) && unitId > 0 },
  });
}
