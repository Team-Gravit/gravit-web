import { describe, expect, it } from 'vitest';

import type { LessonResponse, ProblemResponse } from '@/shared/api/generated/model';

import { toLessonProblems } from './problem';

const objectiveProblem: ProblemResponse = {
  problemId: 101,
  problemType: 'OBJECTIVE',
  instruction: '다음 중 옳은 것은?',
  content: '연결리스트 맨 앞 삽입의 시간복잡도는?',
  isBookmarked: false,
  options: [
    {
      optionId: 10,
      content: 'O(1)',
      explanation: '포인터만 바꾼다',
      isAnswer: true,
      problemId: 101,
    },
    {
      optionId: 11,
      content: 'O(n)',
      explanation: '탐색이 필요할 때다',
      isAnswer: false,
      problemId: 101,
    },
  ],
};

const subjectiveProblem: ProblemResponse = {
  problemId: 102,
  problemType: 'SUBJECTIVE',
  instruction: '빈칸을 채우세요.',
  content: '그래프를 깊이 우선으로 순회하는 알고리즘은?',
  isBookmarked: false,
  answerResponse: { contents: ['DFS'], explanation: '깊이를 우선한다' },
};

function createResponse(problems: ProblemResponse[]): LessonResponse {
  return {
    unitSummaryResponse: { unitId: 3, displayOrder: 1, title: '연결리스트', description: '' },
    problems,
    totalProblems: problems.length,
  };
}

describe('toLessonProblems', () => {
  it('유닛 요약과 문제 수를 그대로 전달한다', () => {
    const result = toLessonProblems(createResponse([objectiveProblem, subjectiveProblem]));

    expect(result.unitSummary.unitId).toBe(3);
    expect(result.unitSummary.title).toBe('연결리스트');
    expect(result.problems).toHaveLength(2);
    expect(result.totalProblems).toBe(2);
  });

  it('응답 순서를 그대로 유지한다', () => {
    const problems = Array.from({ length: 10 }, (_, index) => ({
      ...objectiveProblem,
      problemId: 101 + index,
    }));

    const result = toLessonProblems(createResponse(problems));

    expect(result.problems.map((problem) => problem.problemId)).toEqual([
      101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    ]);
  });

  it('problemType이 OBJECTIVE이면 objective로 좁혀지고 options를 갖는다', () => {
    const [problem] = toLessonProblems(createResponse([objectiveProblem])).problems;

    // 유니온이라 좁히지 않으면 options에 닿을 수 없다. 좁히기 자체가 검증 대상이다.
    expect(problem.type).toBe('objective');
    if (problem.type !== 'objective') {
      throw new Error('objective로 좁혀지지 않았다');
    }

    expect(problem.options).toHaveLength(2);
  });

  it('problemType이 SUBJECTIVE이면 subjective로 좁혀지고 answer를 갖는다', () => {
    const [problem] = toLessonProblems(createResponse([subjectiveProblem])).problems;

    expect(problem.type).toBe('subjective');
    if (problem.type !== 'subjective') {
      throw new Error('subjective로 좁혀지지 않았다');
    }

    expect(problem.answer.contents).toEqual(['DFS']);
    expect(problem.answer.explanation).toBe('깊이를 우선한다');
  });

  it('주관식인데 정답 정보가 없으면 빈 정답으로 채운다', () => {
    const { answerResponse, ...withoutAnswer } = subjectiveProblem;
    void answerResponse;
    const [problem] = toLessonProblems(createResponse([withoutAnswer])).problems;

    if (problem.type !== 'subjective') {
      throw new Error('subjective로 좁혀지지 않았다');
    }

    expect(problem.answer.contents).toEqual([]);
    expect(problem.answer.explanation).toBe('');
  });
});
