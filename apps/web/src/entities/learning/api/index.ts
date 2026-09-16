export {
  getGetLearningQueryKey as getRecentLearningQueryKey,
  getGetUnitsQueryKey as getRecommendedUnitsQueryKey,
  getGetWeeklyRecordQueryKey as getWeeklyRecordQueryKey,
  useGetUnits as useRecommendedUnits,
} from '@/shared/api/generated/mainpage-api/mainpage-api';
export { getGetAllChapterQueryKey as getChaptersQueryKey } from '@/shared/api/generated/chapter-api/chapter-api';
export { getGetAllLessonInUnitQueryKey as getUnitLessonsQueryKey } from '@/shared/api/generated/lesson-api/lesson-api';
export { useChapters } from './use-chapters';
export { useUnitLessons } from './use-unit-lessons';
export { useRecentLearning } from './use-recent-learning';
export { useWeeklyRecord } from './use-weekly-record';
