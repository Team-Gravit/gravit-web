import { useGetAllLessonInUnit } from '@/shared/api/generated/lesson-api/lesson-api';

import { toUnitLessons, type UnitLessons } from '../model/lesson';

export function useUnitLessons(unitId: number) {
  return useGetAllLessonInUnit<UnitLessons>(unitId, {
    query: { select: toUnitLessons, enabled: Number.isInteger(unitId) && unitId > 0 },
  });
}
