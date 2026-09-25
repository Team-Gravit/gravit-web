import type { Problem } from '@/entities/problem';
import type {
  LearningSubmissionSaveRequest,
  ProblemSubmissionSaveRequest,
} from '@/shared/api/generated/model';

import { toAccuracy } from './accuracy';
import type { QuizAnswer, QuizAnswersByProblemId } from './quiz-session';

export interface SubmissionInput {
  lessonId: number;
  problems: Problem[];
  answersByProblemId: QuizAnswersByProblemId;
  /** 초 단위 풀이 시간 */
  learningTime: number;
}

/**
 * 레슨 집계와 제출된 문제별 답을 서버 요청 형식으로 조립한다.
 * 미제출 문제는 상세에서 제외하지만 정확도 계산의 분모에는 포함한다.
 */
export function toSubmissionBody({
  lessonId,
  problems,
  answersByProblemId,
  learningTime,
}: SubmissionInput): LearningSubmissionSaveRequest {
  const problemSubmissionSaveRequests = problems.flatMap((problem) => {
    const answer = answersByProblemId[problem.problemId];

    return answer ? [toProblemSubmission(problem.problemId, answer)] : [];
  });

  return {
    lessonSubmissionSaveRequest: {
      lessonId,
      learningTime,
      accuracy: toAccuracy(problems, answersByProblemId),
    },
    problemSubmissionSaveRequests,
  };
}

function toProblemSubmission(problemId: number, answer: QuizAnswer): ProblemSubmissionSaveRequest {
  if (answer.kind === 'objective') {
    return { problemId, isCorrect: answer.isCorrect, selectedOptionId: answer.selectedOptionId };
  }

  return { problemId, isCorrect: answer.isCorrect, submittedContent: answer.submittedContent };
}
