import type { Problem } from '@/entities/problem';

import type { QuizAnswersByProblemId } from './quiz-session';

export const PROBLEM_PROGRESS_STATUSES = {
  current: 'current',
  completed: 'completed',
  incomplete: 'incomplete',
} as const;

export type ProblemProgressStatus =
  (typeof PROBLEM_PROGRESS_STATUSES)[keyof typeof PROBLEM_PROGRESS_STATUSES];

/**
 * 진행 패널에 표시할 상태를 문제 순서대로 반환한다.
 * 현재 문제는 제출 여부와 관계없이 `current`, 답안을 제출한 나머지는 `completed`,
 * 제출 내역이 없으면 `incomplete`로 표시한다.
 */
export function toProblemProgressStatuses(
  problems: Problem[],
  answersByProblemId: QuizAnswersByProblemId,
  currentProblemIndex: number,
): ProblemProgressStatus[] {
  return problems.map((problem, problemIndex) => {
    if (problemIndex === currentProblemIndex) {
      return PROBLEM_PROGRESS_STATUSES.current;
    }

    const hasSubmittedAnswer = answersByProblemId[problem.problemId] !== undefined;

    if (hasSubmittedAnswer) {
      return PROBLEM_PROGRESS_STATUSES.completed;
    }

    return PROBLEM_PROGRESS_STATUSES.incomplete;
  });
}

/** 정답 여부와 관계없이 답안을 제출한 문제 수를 센다. */
export function countCompletedProblems(
  problems: Problem[],
  answersByProblemId: QuizAnswersByProblemId,
): number {
  return problems.filter((problem) => answersByProblemId[problem.problemId] !== undefined).length;
}
