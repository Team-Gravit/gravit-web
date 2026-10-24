import {
  getGetQuestionsQueryKey,
  useGetQuestions,
} from '@/shared/api/generated/interview-session-api/interview-session-api';

export { getGetQuestionsQueryKey as getInterviewQuestionsQueryKey };

/**
 * 세션 문항 목록 조회. 문항·음성 링크·inputType 은 세션 중 변하지 않으므로
 * staleTime: Infinity 로 한 번만 받아 캐시에서 공유한다.
 */
export function useInterviewQuestions(sessionId: number) {
  return useGetQuestions(sessionId, {
    query: { staleTime: Infinity, enabled: Number.isInteger(sessionId) && sessionId > 0 },
  });
}
