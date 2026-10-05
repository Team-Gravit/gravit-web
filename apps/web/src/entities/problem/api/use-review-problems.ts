import { useQuery } from '@tanstack/react-query';

import {
  getAllBookmarkedProblemInUnit,
  getGetAllBookmarkedProblemInUnitQueryKey,
} from '@/shared/api/generated/bookmark-api/bookmark-api';
import {
  getAllWrongAnsweredProblemInUnit,
  getGetAllWrongAnsweredProblemInUnitQueryKey,
} from '@/shared/api/generated/wronganswerednote-api/wronganswerednote-api';

import { toLessonProblems } from '../model/problem';

/** 유닛에서 모아 다시 푸는 문제 목록의 종류. */
export type ReviewProblemsKind = 'bookmark' | 'wrongAnswer';

export function getReviewProblemsQueryKey(kind: ReviewProblemsKind, unitId: number) {
  return kind === 'bookmark'
    ? getGetAllBookmarkedProblemInUnitQueryKey(unitId)
    : getGetAllWrongAnsweredProblemInUnitQueryKey(unitId);
}

/**
 * 북마크·오답 문제 목록. 응답 모양이 레슨 문제와 같아 같은 변환을 쓴다.
 * 풀이 중에는 다시 받지 않는다. 해제한 북마크나 제외한 문제가 빠지면 풀이가 처음부터 다시 시작되기 때문이다.
 * 새로 받는 시점은 풀이를 떠날 때의 무효화다.
 */
export function useReviewProblems(kind: ReviewProblemsKind, unitId: number) {
  return useQuery({
    queryKey: getReviewProblemsQueryKey(kind, unitId),
    queryFn: ({ signal }) =>
      kind === 'bookmark'
        ? getAllBookmarkedProblemInUnit(unitId, undefined, signal)
        : getAllWrongAnsweredProblemInUnit(unitId, undefined, signal),
    select: toLessonProblems,
    enabled: Number.isInteger(unitId) && unitId > 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
