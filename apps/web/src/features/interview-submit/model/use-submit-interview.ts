import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  ABANDONED_SESSION_MESSAGE,
  getInterviewSessionStatusQueryKey,
  getServerErrorMessage,
  isAbandonedSessionError,
  isSubmittedSessionError,
  useInterviewSessionStore,
} from '@/entities/interview-session';
import type { InterviewSessionStatusResponse } from '@/shared/api/generated/model';
import { toast } from '@/shared/ui/toast';

import { useSubmitInterviewMutation } from '../api/submit-interview-mutation';
import { toSubmitBody } from './to-submit-body';

/**
 * store에 모인 답변을 일괄 제출한다. 성공 시 세션 상태 캐시를 GRADING으로 낙관적 갱신해
 * 채점 대기 화면이 깜빡임 없이 이어지게 하고, 이후 흐름(이동 등)은 호출부가 options로 결정한다.
 * 진행 상태 비우기는 더 이상 여기서 하지 않고 언마운트(useResetSessionOnExit)가 맡는다.
 */
export function useSubmitInterview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useSubmitInterviewMutation();

  const submit = (options?: { onSuccess?: () => void }) => {
    const { sessionId, answers } = useInterviewSessionStore.getState();
    if (sessionId == null) {
      return;
    }
    mutation.mutate(
      { sessionId, data: toSubmitBody(answers) },
      {
        onSuccess: () => {
          queryClient.setQueryData<InterviewSessionStatusResponse>(
            getInterviewSessionStatusQueryKey(sessionId),
            (prev) => (prev ? { ...prev, status: 'GRADING' } : prev),
          );
          options?.onSuccess?.();
        },
        // 멀티탭·기기에서 세션 상태가 바뀐 경우: 취소(4025)면 홈, 이미 제출(4026)이면 결과 페이지로.
        onError: (error) => {
          if (isAbandonedSessionError(error)) {
            toast(getServerErrorMessage(error) ?? ABANDONED_SESSION_MESSAGE);
            navigate({ to: '/interview' });
            return;
          }
          if (isSubmittedSessionError(error)) {
            navigate({
              to: '/interview/sessions/grading/$sessionId',
              params: { sessionId: String(sessionId) },
              replace: true,
            });
          }
        },
      },
    );
  };

  return { submit, isPending: mutation.isPending };
}
