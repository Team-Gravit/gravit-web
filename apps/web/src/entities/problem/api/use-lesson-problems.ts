import { useGetAllProblemInLesson } from '@/shared/api/generated/problem-api/problem-api';

import { toLessonProblems, type LessonProblems } from '../model/problem';

export function useLessonProblems(lessonId: number) {
  return useGetAllProblemInLesson<LessonProblems>(lessonId, {
    query: { select: toLessonProblems, enabled: Number.isInteger(lessonId) && lessonId > 0 },
  });
}
