import { describe, expect, it } from 'vitest';

import type { Problem } from '@/entities/problem';

import { toAccuracy } from './accuracy';
import type { QuizAnswersByProblemId } from './quiz-session';

function objectiveProblem(problemId: number): Problem {
  return {
    problemId,
    type: 'objective',
    instruction: '발문',
    content: '본문',
    options: [],
  };
}

function correct(selectedOptionId: number) {
  return { kind: 'objective', selectedOptionId, isCorrect: true } as const;
}

function incorrect(selectedOptionId: number) {
  return { kind: 'objective', selectedOptionId, isCorrect: false } as const;
}

describe('toAccuracy', () => {
  it('미완료는 오답과 같게 계산한다 — 분모는 전체 문제 수다', () => {
    const problems = Array.from({ length: 10 }, (_, index) => objectiveProblem(101 + index));
    const answersByProblemId: QuizAnswersByProblemId = {
      101: correct(1),
      102: correct(2),
      103: correct(3),
      104: incorrect(4),
      105: incorrect(5),
    };

    expect(toAccuracy(problems, answersByProblemId)).toBe(30);
  });

  it('나누어떨어지지 않으면 정수로 반올림한다', () => {
    const problems = [objectiveProblem(101), objectiveProblem(102), objectiveProblem(103)];

    expect(toAccuracy(problems, { 101: correct(1), 102: correct(2) })).toBe(67);
  });

  it('문제가 없으면 0을 반환한다', () => {
    expect(toAccuracy([], {})).toBe(0);
  });
});
