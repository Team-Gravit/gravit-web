export {
  getGetLearningQueryKey as getRecentLearningQueryKey,
  getGetUnitsQueryKey as getRecommendedUnitsQueryKey,
  getGetWeeklyRecordQueryKey as getWeeklyRecordQueryKey,
  useGetUnits as useRecommendedUnits,
} from '@/shared/api/generated/mainpage-api/mainpage-api';
export { getGetAllChapterQueryKey as getChaptersQueryKey } from '@/shared/api/generated/chapter-api/chapter-api';
export { getGetAllLessonInUnitQueryKey as getUnitLessonsQueryKey } from '@/shared/api/generated/lesson-api/lesson-api';
export { getGetAllUnitInChapterQueryKey as getUnitsInChapterQueryKey } from '@/shared/api/generated/unit-api/unit-api';
export { useChapters } from './use-chapters';
export { useRecentLearning } from './use-recent-learning';
export { useUnitLessons } from './use-unit-lessons';
export { useUnitsInChapter } from './use-units-in-chapter';
export { useWeeklyRecord } from './use-weekly-record';

// 마이페이지 학습 집계 조회. 화면 전용 BFF 경로(/my-pages/learning/*)지만 데이터는 학습 도메인이다.
export {
  useGetMyPageSummary as useMyPageSummary,
  useGetMyPageLearningHistory as useMyPageLearningHistory,
} from '@/shared/api/generated/mypage-api/mypage-api';
