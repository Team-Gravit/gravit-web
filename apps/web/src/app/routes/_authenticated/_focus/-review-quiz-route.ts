import { notFound, type AnyRouteMatch } from '@tanstack/react-router';

import { getUnitLessonsQueryKey } from '@/entities/learning';
import { getReviewProblemsQueryKey, type ReviewProblemsKind } from '@/entities/problem';
import { clearStoredQuizSession } from '@/features/lesson-quiz';
import { toReviewQuizSessionKey } from '@/pages/review-quiz';

import type { RouterContext } from '../../__root';

/** 북마크·오답 풀이 라우트가 함께 쓰는 진입 검증. 유효하지 않은 ID 는 조회를 시작하지 못해 막는다. */
export function validateReviewQuizUnitId({ params }: { params: { unitId: string } }) {
  const unitId = Number(params.unitId);

  if (!Number.isInteger(unitId) || unitId <= 0) {
    throw notFound();
  }

  return { unitId };
}

/**
 * 풀이를 떠날 때(닫기 · 완료 · 뒤로가기) 목록과 유닛 상세를 새로 받게 하고 저장본을 지운다.
 * 해제한 북마크·제외한 문제는 풀이 중에는 목록에 남고 여기서 빠진다. 새로고침은 떠나는 것이 아니다.
 * 유닛 상세의 북마크·오답노트 풀이 가능 여부는 단건 제출로도 바뀔 수 있어 함께 무효화한다.
 */
export function createReviewQuizLeaveHandler(kind: ReviewProblemsKind) {
  return (match: AnyRouteMatch) => {
    const unitId = Number(match.params.unitId);
    const { queryClient } = match.context as RouterContext;

    clearStoredQuizSession(toReviewQuizSessionKey(kind, unitId));
    void queryClient.invalidateQueries({
      queryKey: getReviewProblemsQueryKey(kind, unitId),
      exact: true,
    });
    void queryClient.invalidateQueries({ queryKey: getUnitLessonsQueryKey(unitId), exact: true });
  };
}
