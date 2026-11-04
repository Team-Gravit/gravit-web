import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  getInterviewSessionStatusQueryKey,
  useInterviewSessionStore,
} from '@/entities/interview-session';

import { useAbandon } from '../api';

/**
 * 면접을 중단한다. 요청 성공/실패와 무관하게 /interview 로 이동한 뒤 진행 상태(persist 포함)를 비운다.
 * 이동 목적지는 중단 동작에서 항상 /interview 로 불변이라 호출부 콜백으로 올리지 않고 여기서 처리한다.
 */
export function useAbandonInterview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionId = useInterviewSessionStore((s) => s.sessionId);
  const reset = useInterviewSessionStore((s) => s.reset);
  const { mutate, isPending } = useAbandon({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: getInterviewSessionStatusQueryKey(data.sessionId),
          refetchType: 'none',
        });
      },
    },
  });

  const abandon = () => {
    if (sessionId == null) {
      return;
    }
    // 이미 취소(4025)·제출(4026)된 세션이라 중단 요청이 실패해도 사용자는 나가려는 것이므로
    // 성공/실패와 무관하게 /interview 로 이동한 뒤 진행 상태를 비운다.
    mutate(
      { sessionId },
      {
        onSettled: () => {
          navigate({ to: '/interview', replace: true }).then(() => reset());
        },
      },
    );
  };

  return { abandon, isPending };
}
