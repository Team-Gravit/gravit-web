import type { ReviewProblemsKind } from '@/entities/problem';

// 라우트 설정(onLeave)도 이 함수를 쓴다. 페이지 파일에 두면 라우트 설정이 첫 청크에 퀴즈 화면을 끌고 온다.
/** 새로고침 저장본의 키. 레슨 저장본(레슨 ID)과 겹치지 않게 종류를 붙인다. */
export function toReviewQuizSessionKey(kind: ReviewProblemsKind, unitId: number): string {
  return `review:${kind}:${unitId}`;
}
