import { useDeleteWrongAnsweredProblem } from '@/shared/api/generated/wronganswerednote-api/wronganswerednote-api';
import { toast } from '@/shared/ui/toast';

import {
  WRONG_ANSWER_EXCLUDE_FAILURE_MESSAGE,
  WRONG_ANSWER_EXCLUDED_MESSAGE,
} from '../model/constants';

interface UseExcludeWrongAnswerOptions {
  onExcluded: (problemId: number) => void;
}

/**
 * 문제를 오답노트에서 내린다. 서버는 기록을 남기고, 다시 틀리면 오답노트로 되돌린다.
 * 지금 풀고 있는 목록에서는 빼지 않는다 — 목록은 풀이를 떠날 때 다시 받는다.
 */
export function useExcludeWrongAnswer({ onExcluded }: UseExcludeWrongAnswerOptions) {
  const mutation = useDeleteWrongAnsweredProblem({
    mutation: {
      retry: false,
      onSuccess: (_response, { data }) => {
        toast(WRONG_ANSWER_EXCLUDED_MESSAGE);
        onExcluded(data.problemId);
      },
      onError: () => toast(WRONG_ANSWER_EXCLUDE_FAILURE_MESSAGE),
    },
  });

  return {
    excludeWrongAnswer: (problemId: number) => mutation.mutate({ data: { problemId } }),
    isPending: mutation.isPending,
  };
}
