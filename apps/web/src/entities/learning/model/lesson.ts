import type { LessonDetailResponse, UnitSummaryResponse } from '@/shared/api/generated/model';

import { formatUnitNumber } from './unit-progress';

/**
 * API가 `isSolved`만 제공해 완료·미완료만 구분한다.
 * 서버가 진행 상태 필드를 제공하면 `inProgress`를 추가한다.
 */
export type LessonStatus = 'completed' | 'notStarted';

export interface Lesson {
  lessonId: number;
  title: string;
  problemCount: number;
  status: LessonStatus;
}

export interface UnitLessons {
  chapterId: number;
  chapterTitle: string;
  unitLabel: string;
  unitDescription: string;
  lessons: Lesson[];
}

export function toUnitLabel(unit: UnitSummaryResponse): string {
  return `Unit${formatUnitNumber(unit.displayOrder)}`;
}

export function toUnitLessons(response: LessonDetailResponse): UnitLessons {
  return {
    chapterId: response.chapterSummary.chapterId,
    chapterTitle: response.chapterSummary.title,
    unitLabel: toUnitLabel(response.unitSummaryResponse),
    unitDescription: response.unitSummaryResponse.description,
    lessons: response.lessonSummaries.map((lesson) => ({
      lessonId: lesson.lessonId,
      title: lesson.title,
      problemCount: lesson.totalProblem,
      status: lesson.isSolved ? 'completed' : 'notStarted',
    })),
  };
}
