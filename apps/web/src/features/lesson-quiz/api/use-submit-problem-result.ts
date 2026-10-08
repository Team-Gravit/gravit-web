import { useCallback } from 'react';

import { useSaveProblemSubmission } from '@/shared/api/generated/problem-api/problem-api';
import { toast } from '@/shared/ui/toast';

import type { SubmitAnswerInput } from '../model/quiz-session';
import { toProblemSubmission } from '../model/submission';

const SUBMIT_PROBLEM_FAILURE_MESSAGE = '답안을 저장하지 못했어요. 다시 시도해 주세요.';

/**
 * 복습 풀이에서 답 하나를 바로 저장한다. 실패하면 토스트로 알리고 호출자에게 다시 던진다 —
 * 호출자(세션)는 실패한 답을 기록하지 않아 사용자가 다시 고를 수 있다.
 */
export function useSubmitProblemResult() {
  const { mutateAsync } = useSaveProblemSubmission({ mutation: { retry: false } });

  // 세션 Provider 의 콜백 의존성으로 들어가므로 참조를 유지한다.
  const submitProblemResult = useCallback(
    async ({ problemId, answer }: SubmitAnswerInput) => {
      try {
        await mutateAsync({ data: toProblemSubmission(problemId, answer) });
      } catch (error) {
        toast(SUBMIT_PROBLEM_FAILURE_MESSAGE);
        throw error;
      }
    },
    [mutateAsync],
  );

  return { submitProblemResult };
}
