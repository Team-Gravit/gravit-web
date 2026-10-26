import {
  getGetStatusQueryKey,
  useGetStatus,
} from '@/shared/api/generated/interview-session-api/interview-session-api';

export { getGetStatusQueryKey as getInterviewSessionStatusQueryKey };

/**
 * 세션 상태 조회. `refetchWhileGrading`이면 채점이 끝날 때까지(COMPLETED/GRADING_FAILED) 2초마다 폴링한다.
 * 기본은 1회 조회(세션 진입 가드 등).
 */
export function useInterviewSessionStatus(
  sessionId: number,
  options?: { refetchWhileGrading?: boolean },
) {
  return useGetStatus(sessionId, {
    query: {
      enabled: Number.isInteger(sessionId) && sessionId > 0,
      refetchInterval: (query) => {
        if (!options?.refetchWhileGrading) {
          return false;
        }
        const status = query.state.data?.status;
        return status === 'COMPLETED' || status === 'GRADING_FAILED' ? false : 2000;
      },
    },
  });
}
