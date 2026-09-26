import type {
  AnswerResponse,
  LessonResponse,
  OptionResponse,
  ProblemResponse,
  UnitSummaryResponse,
} from '@/shared/api/generated/model';

export type ProblemType = 'objective' | 'subjective';

interface ProblemBase {
  problemId: number;
  /** 발문 — 무엇을 하라는 지시. */
  instruction: string;
  /** 본문 — 문제의 내용. */
  content: string;
  isBookmarked: boolean;
}

export interface ObjectiveProblem extends ProblemBase {
  type: 'objective';
  options: OptionResponse[];
}

export interface SubjectiveProblem extends ProblemBase {
  type: 'subjective';
  answer: AnswerResponse;
}

export type Problem = ObjectiveProblem | SubjectiveProblem;

export interface LessonProblems {
  unitSummary: UnitSummaryResponse;
  problems: Problem[];
  totalProblems: number;
}

/** 정답 정보가 빠진 주관식 응답의 기본값. */
const EMPTY_ANSWER: AnswerResponse = { contents: [], explanation: '' };

function toProblem(problem: ProblemResponse): Problem {
  const base: ProblemBase = {
    problemId: problem.problemId,
    instruction: problem.instruction,
    content: problem.content,
    isBookmarked: problem.isBookmarked,
  };

  if (problem.problemType === 'OBJECTIVE') {
    return { ...base, type: 'objective', options: problem.options ?? [] };
  }

  return { ...base, type: 'subjective', answer: problem.answerResponse ?? EMPTY_ANSWER };
}

export function toLessonProblems(response: LessonResponse): LessonProblems {
  return {
    unitSummary: response.unitSummaryResponse,
    problems: response.problems.map(toProblem),
    totalProblems: response.totalProblems,
  };
}
