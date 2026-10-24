import { INTERVIEW_QUESTION_COUNT, type InterviewAnswer } from '@/entities/interview-session';
import type { InterviewSubmitRequest } from '@/shared/api/generated/model/interviewSubmitRequest';

/**
 * store의 answers를 제출 본문으로 변환한다(displayOrder 1..N 오름차순).
 * 백엔드가 전 문항을 기대하므로, 미응답(0바이트로 건너뛴 문항 등)은 빈 값으로 채워 모두 보낸다.
 */
export function toSubmitBody(answers: Record<number, InterviewAnswer>): InterviewSubmitRequest {
  return {
    answers: Array.from({ length: INTERVIEW_QUESTION_COUNT }, (_, index) => {
      const displayOrder = index + 1;
      const answer = answers[displayOrder];
      return {
        displayOrder,
        content: answer?.content ?? '',
        // 생성 타입이 audioKey?: string 이라 null/미응답은 undefined 로 보낸다(TEXT·무응답은 키 없음).
        audioKey: answer?.audioKey ?? undefined,
      };
    }),
  };
}
