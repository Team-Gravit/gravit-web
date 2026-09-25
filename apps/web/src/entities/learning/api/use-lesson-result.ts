import { useGetLessonResult } from '@/shared/api/generated/lesson-api/lesson-api';

/**
 * 레슨 제출 결과 조회
 *
 * 결과는 별도 라우트라 주소로 직접 들어올 수 있다(ADR-2). 파라미터가 숫자가 아니면 요청하지
 * 않고, 화면이 실패 상태를 그린다.
 */
export function useLessonResult(lessonSubmissionId: number) {
  return useGetLessonResult(lessonSubmissionId, {
    query: { enabled: Number.isInteger(lessonSubmissionId) && lessonSubmissionId > 0 },
  });
}
