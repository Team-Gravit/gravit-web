import { useNavigate } from '@tanstack/react-router';

import { useInterviewSessionStore } from '@/entities/interview-session';

import { useAbandon } from '../api';

/**
 * 면접을 중단한다. 중단 API 성공 시 진행 상태(persist 포함)를 비우고 메인으로 이동한다.
 * 이동 목적지는 중단 동작에서 항상 /main 으로 불변이라 호출부 콜백으로 올리지 않고 여기서 처리한다.
 */
export function useAbandonInterview() {
  const navigate = useNavigate();
  const sessionId = useInterviewSessionStore((s) => s.sessionId);
  const reset = useInterviewSessionStore((s) => s.reset);
  const { mutate, isPending } = useAbandon();

  const abandon = () => {
    if (sessionId == null) {
      return;
    }
    // 이미 취소(4025)·제출(4026)된 세션이라 중단 요청이 실패해도 사용자는 나가려는 것이므로
    // 성공/실패와 무관하게 진행 상태를 비우고 메인으로 이동한다.
    mutate(
      { sessionId },
      {
        onSettled: () => {
          reset();
          navigate({ to: '/main' });
        },
      },
    );
  };

  return { abandon, isPending };
}
