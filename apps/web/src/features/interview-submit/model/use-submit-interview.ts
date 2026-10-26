import { useNavigate } from '@tanstack/react-router';

import {
  ABANDONED_SESSION_MESSAGE,
  getServerErrorMessage,
  isAbandonedSessionError,
  isSubmittedSessionError,
  useInterviewSessionStore,
} from '@/entities/interview-session';
import { toast } from '@/shared/ui/toast';

import { useSubmitInterviewMutation } from '../api/submit-interview-mutation';
import { toSubmitBody } from './to-submit-body';

/**
 * store에 모인 답변을 일괄 제출한다. 성공 시 진행 버퍼(persist 포함)를 비우고,
 * 이후 흐름(이동 등)은 호출부가 options로 결정한다.
 */
export function useSubmitInterview() {
  const navigate = useNavigate();
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
