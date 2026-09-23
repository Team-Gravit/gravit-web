import { describe, expect, it } from 'vitest';

import type { Problem } from '@/entities/problem';

import { countCompletedProblems, toProblemProgressStatuses } from './progress';

function createProblem(problemId: number): Problem {
  return {
    problemId,
    type: 'objective',
    instruction: '발문',
    content: '본문',
    options: [],
  };
}

const PROBLEMS = [createProblem(101), createProblem(102), createProblem(103)];
const ANSWERS = {
  101: { kind: 'objective', selectedOptionId: 10, isCorrect: true },
} as const;

describe('toProblemProgressStatuses', () => {
  it('제출한 문제는 completed, 보고 있는 문제는 current, 나머지는 incomplete다', () => {
    expect(toProblemProgressStatuses(PROBLEMS, ANSWERS, 1)).toEqual([
      'completed',
      'current',
      'incomplete',
    ]);
  });

  it('보고 있는 문제는 제출했더라도 current다', () => {
    expect(toProblemProgressStatuses(PROBLEMS, ANSWERS, 0)).toEqual([
      'current',
      'incomplete',
      'incomplete',
    ]);
  });

  it('아무것도 제출하지 않았으면 현재 문제 외에는 모두 incomplete다', () => {
    expect(toProblemProgressStatuses(PROBLEMS, {}, 2)).toEqual([
      'incomplete',
      'incomplete',
      'current',
    ]);
  });
});

describe('countCompletedProblems', () => {
  it('제출한 문제 수를 센다', () => {
    expect(countCompletedProblems(PROBLEMS, ANSWERS)).toBe(1);
  });

  it('제출이 없으면 0이다', () => {
    expect(countCompletedProblems(PROBLEMS, {})).toBe(0);
  });
});
