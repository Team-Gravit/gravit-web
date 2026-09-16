import { describe, expect, it } from 'vitest';

import type { LessonDetailResponse } from '@/shared/api/generated/model';

import { toUnitLessons } from './lesson';

function createResponse(
  lessonSummaries: LessonDetailResponse['lessonSummaries'],
): LessonDetailResponse {
  return {
    chapterSummary: { chapterId: 7, title: '자료구조' },
    unitSummaryResponse: { unitId: 21, title: '리스트', description: '리스트를 학습합니다.' },
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

  it('서버가 순번을 주지 않으므로 유닛 이름을 라벨로 쓴다', () => {
    // unitId(21)를 순번으로 쓰면 챕터의 21번째 유닛처럼 보이므로 쓰지 않는다.
    expect(toUnitLessons(createResponse([])).unitLabel).toBe('리스트');
  });
});
