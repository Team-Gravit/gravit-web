import { describe, expect, it } from 'vitest';

import type { LessonDetailResponse } from '@/shared/api/generated/model';

import { toUnitLessons } from './lesson';

function createResponse(
  lessonSummaries: LessonDetailResponse['lessonSummaries'],
): LessonDetailResponse {
  return {
    chapterSummary: { chapterId: 7, title: '자료구조' },
    unitSummaryResponse: {
      unitId: 21,
      displayOrder: 1,
      title: '리스트',
      description: '리스트를 학습합니다.',
    },
    bookmarkAccessible: true,
    wrongAnsweredNoteAccessible: true,
    unitId: 21,
    lessonSummaries,
  };
}

describe('toUnitLessons', () => {
  it('챕터·유닛 요약을 화면 모델로 옮긴다', () => {
    const result = toUnitLessons(createResponse([]));

    expect(result.chapterId).toBe(7);
    expect(result.chapterTitle).toBe('자료구조');
    expect(result.unitDescription).toBe('리스트를 학습합니다.');
  });

  it('레슨이 없으면 빈 배열을 반환한다', () => {
    expect(toUnitLessons(createResponse([])).lessons).toEqual([]);
  });

  it('isSolved 가 true 면 completed, false 면 notStarted 가 된다', () => {
    const result = toUnitLessons(
      createResponse([
        { lessonId: 1, title: 'Lesson01', totalProblem: 10, isSolved: true },
        { lessonId: 2, title: 'Lesson02', totalProblem: 5, isSolved: false },
      ]),
    );

    expect(result.lessons).toEqual([
      { lessonId: 1, title: 'Lesson01', problemCount: 10, status: 'completed' },
      { lessonId: 2, title: 'Lesson02', problemCount: 5, status: 'notStarted' },
    ]);
  });

  it('displayOrder를 두 자리 Unit 라벨로 바꾼다', () => {
    expect(toUnitLessons(createResponse([])).unitLabel).toBe('Unit01');
  });
});
