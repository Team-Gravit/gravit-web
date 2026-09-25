import { describe, expect, it } from 'vitest';

import type { Problem } from '@/entities/problem';

import { toSubmissionBody } from './submission';

function objectiveProblem(problemId: number): Problem {
  return {
    problemId,
    type: 'objective',
    instruction: '발문',
    content: '본문',
    options: [],
  };
}

function subjectiveProblem(problemId: number): Problem {
  return {
    problemId,
    type: 'subjective',
    instruction: '발문',
    content: '본문',
    answer: { contents: ['DFS'], explanation: '해설' },
  };
}

describe('toSubmissionBody', () => {
  it('레슨 집계와 문제별 답을 함께 담는다', () => {
    const body = toSubmissionBody({
      lessonId: 7,
      problems: Array.from({ length: 10 }, (_, index) => objectiveProblem(101 + index)),
      answersByProblemId: { 101: { kind: 'objective', selectedOptionId: 10, isCorrect: true } },
      learningTime: 80,
    });

    expect(body.lessonSubmissionSaveRequest).toEqual({
      lessonId: 7,
      learningTime: 80,
      accuracy: 10,
    });
    expect(body.problemSubmissionSaveRequests).toHaveLength(1);
    expect(body.problemSubmissionSaveRequests[0]).toEqual({
      problemId: 101,
      isCorrect: true,
      selectedOptionId: 10,
    });
  });

  it('주관식은 제출한 내용을 담는다', () => {
    const body = toSubmissionBody({
      lessonId: 7,
      problems: [subjectiveProblem(102)],
      answersByProblemId: {
        102: { kind: 'subjective', submittedContent: 'BFS', isCorrect: false },
      },
      learningTime: 12,
    });

    expect(body.problemSubmissionSaveRequests[0]).toEqual({
      problemId: 102,
      isCorrect: false,
      submittedContent: 'BFS',
    });
  });

  it('제출하지 않고 넘어간 문제는 문제별 항목에서 빠진다', () => {
    const body = toSubmissionBody({
      lessonId: 7,
      problems: [objectiveProblem(101), objectiveProblem(102), objectiveProblem(103)],
      answersByProblemId: { 102: { kind: 'objective', selectedOptionId: 20, isCorrect: true } },
      learningTime: 30,
    });

    expect(body.problemSubmissionSaveRequests).toHaveLength(1);
    // 미제출 문제도 분모에 포함하므로 정확도는 1/3을 반올림한 33이다.
    expect(body.lessonSubmissionSaveRequest.accuracy).toBe(33);
  });
});
