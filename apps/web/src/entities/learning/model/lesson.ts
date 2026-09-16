import type { LessonDetailResponse, UnitSummaryResponse } from '@/shared/api/generated/model';

/**
 * 레슨의 학습 상태.
 *
 * 시안에는 `학습 중`을 포함한 세 가지가 있으나 `LessonSummaryResponse`가 `isSolved` 하나만
 * 주어 두 가지만 구분한다. 서버가 진행 상태 필드를 주면 여기에 값을 추가한다 (MIG-030 §확인 필요 2).
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
  /** 화면에 보이는 유닛 이름. `toUnitLabel` 참고. */
  unitLabel: string;
  unitDescription: string;
  lessons: Lesson[];
}

/**
 * 화면에 보이는 유닛 이름을 만든다.
 *
 * 시안은 `Unit01`처럼 챕터 안에서의 순번을 쓰지만 레슨 조회 응답에 그 값이 없다.
 * `unitId`는 챕터 내 순번이 아니라서 순번 자리에 쓰면 틀린 번호가 표시되므로, 서버가 순번
 * 필드를 줄 때까지 유닛 이름을 그대로 쓴다. 필드가 생기면 이 함수만 바꾼다.
 */
export function toUnitLabel(unit: UnitSummaryResponse): string {
  return unit.title;
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
