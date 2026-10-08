import { describe, expect, it } from 'vitest';

import type { OptionResponse } from '@/shared/api/generated/model';

import { gradeObjective } from './grade-objective';

const OPTIONS: OptionResponse[] = [
  { optionId: 10, content: 'O(1)', explanation: '포인터만 바꾼다', isAnswer: true, problemId: 101 },
  {
    optionId: 11,
    content: 'O(n)',
    explanation: '탐색이 필요할 때다',
    isAnswer: false,
    problemId: 101,
  },
];

describe('gradeObjective', () => {
  it('isAnswer가 false인 선지를 고르면 false를 반환한다', () => {
    expect(gradeObjective(OPTIONS, 11)).toBe(false);
  });

  it('isAnswer가 true인 선지를 고르면 true를 반환한다', () => {
    expect(gradeObjective(OPTIONS, 10)).toBe(true);
  });

  it('목록에 없는 optionId를 고르면 false를 반환한다', () => {
    expect(gradeObjective(OPTIONS, 99)).toBe(false);
  });
});
