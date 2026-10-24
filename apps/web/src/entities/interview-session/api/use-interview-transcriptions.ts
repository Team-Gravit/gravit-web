import {
  getGetTranscriptionsQueryKey,
  useGetTranscriptions,
} from '@/shared/api/generated/interview-session-api/interview-session-api';
import type { InterviewTranscriptionsResponse } from '@/shared/api/generated/model/interviewTranscriptionsResponse';

export { getGetTranscriptionsQueryKey as getInterviewTranscriptionsQueryKey };

/** 모든 문항의 변환이 종료 상태(COMPLETED | FAILED)인지. 하나라도 PENDING/미요청이면 false. */
export function isAllTranscriptionsTerminal(data?: InterviewTranscriptionsResponse): boolean {
  if (!data) {
    return false;
  }
  return data.transcriptions.every((t) => t.status === 'COMPLETED' || t.status === 'FAILED');
}

/**
 * 문항별 STT 변환 결과를 batch 조회한다. 하나라도 PENDING이면 3초마다 폴링하고,
 * 전부 종료 상태가 되면 폴링을 멈춘다.
 */
export function useInterviewTranscriptions(sessionId: number, options?: { enabled?: boolean }) {
  return useGetTranscriptions(sessionId, {
    query: {
      enabled: Number.isInteger(sessionId) && sessionId > 0 && (options?.enabled ?? true),
      refetchInterval: (query) => (isAllTranscriptionsTerminal(query.state.data) ? false : 3000),
    },
  });
}
