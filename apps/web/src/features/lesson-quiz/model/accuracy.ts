import type { Problem } from '@/entities/problem';

import type { QuizAnswersByProblemId } from './quiz-session';

/** 미제출 문제까지 전체 문제 수에 포함해 정답률을 계산한다. */
export function toAccuracy(
  problems: Problem[],
  answersByProblemId: QuizAnswersByProblemId,
): number {
  if (problems.length === 0) {
    return 0;
  }

  const correctCount = problems.filter(
    (problem) => answersByProblemId[problem.problemId]?.isCorrect === true,
  ).length;

  return Math.round((correctCount / problems.length) * 100);
}
