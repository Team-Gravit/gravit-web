import { useCreate } from '@/shared/api/generated/interview-session-api/interview-session-api';
import { toast } from '@/shared/ui/toast';

// 서버가 문자열 메시지를 주지 않은 경우에만 사용하는 대체 문구.
const CREATE_FAILURE_MESSAGE = '세션을 만들지 못했어요. 다시 시도해 주세요.';

/**
 * 성공하면 sessionId를 전달하고 화면 이동이 끝날 때까지 로딩을 유지한다.
 * 실패하면 서버 메시지를 토스트로 보여준다. 선택 초안은 그대로 두어 다시 시도할 수 있다.
 */
export function useCreateInterviewSession(onCreated: (sessionId: number) => Promise<void>) {
  return useCreate({
    mutation: {
      // 콜백의 Promise를 반환해야 화면 이동 중에도 시작 버튼이 로딩 상태를 유지한다.
      onSuccess: ({ sessionId }) => onCreated(sessionId),
      onError: (error) => {
        // 문제 풀 부족(409)처럼 서버가 알려 준 실패 사유를 우선 표시한다.
        const message = error.response?.data.message;
        toast(typeof message === 'string' ? message : CREATE_FAILURE_MESSAGE);
      },
    },
  });
}
