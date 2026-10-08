import { useQueryClient, type QueryKey } from '@tanstack/react-query';

import {
  useAddBookmark,
  useDeleteBookmark,
} from '@/shared/api/generated/bookmark-api/bookmark-api';
import type { LessonResponse } from '@/shared/api/generated/model';
import { toast } from '@/shared/ui/toast';
import { getUnitLessonsQueryKey } from '@/entities/learning';

import {
  BOOKMARK_ADD_FAILURE_MESSAGE,
  BOOKMARK_ADDED_MESSAGE,
  BOOKMARK_REMOVE_FAILURE_MESSAGE,
  BOOKMARK_REMOVED_MESSAGE,
} from '../model/constants';

interface UseToggleProblemBookmarkOptions {
  /** 지금 풀고 있는 문제 목록의 캐시 키. 레슨 문제 · 북마크 목록 · 오답 목록이 같은 응답 모양이다. */
  problemsQueryKey: QueryKey;
  /** 문제가 속한 유닛. 유닛 상세의 북마크 풀이 가능 여부를 다시 받게 한다. */
  unitId: number;
}

/**
 * 문제 목록 캐시의 북마크 표시를 먼저 바꾸고 요청이 실패하면 되돌린다.
 * 목록에서 문제를 빼지는 않는다 — 북마크 풀이 중에 해제해도 그 문제는 계속 풀 수 있어야 한다.
 */
export function useToggleProblemBookmark({
  problemsQueryKey,
  unitId,
}: UseToggleProblemBookmarkOptions) {
  const queryClient = useQueryClient();

  const setProblemBookmarkInCache = (problemId: number, isBookmarked: boolean) => {
    queryClient.setQueryData<LessonResponse>(
      problemsQueryKey,
      (problemList) =>
        problemList && {
          ...problemList,
          problems: problemList.problems.map((problem) =>
            problem.problemId === problemId ? { ...problem, isBookmarked } : problem,
          ),
        },
    );
  };

  const applyOptimisticBookmark = async (problemId: number, isBookmarked: boolean) => {
    // 낙관적 갱신 전 기존 조회 취소
    await queryClient.cancelQueries({ queryKey: problemsQueryKey, exact: true });
    setProblemBookmarkInCache(problemId, isBookmarked);
  };

  // 문제 목록 캐시가 stale 상태임을 표시
  const markProblemsStale = () =>
    queryClient.invalidateQueries({
      queryKey: problemsQueryKey,
      exact: true,
      // 즉시 재조회하지 않고, 현재 화면은 낙관적 상태를 유지한다. 다음 조회에서 서버 상태를 확인한다.
      refetchType: 'none',
    });

  // 유닛 상세의 `bookmarkAccessible` 은 유닛 전체 북마크 수에서 나온 값이라 화면에서 계산할 수 없다.
  // 해제가 마지막 북마크였는지 모르므로 서버 값을 다시 받는다. 유닛 상세가 화면에 없으면 돌아갈 때 받는다.
  const invalidateUnitLessons = () =>
    queryClient.invalidateQueries({ queryKey: getUnitLessonsQueryKey(unitId), exact: true });

  /**
   * mutation의 생명주기: onMutate ⭢ 실제 API 요청 ⭢ onSuccess 또는 onError ⭢ onSettled
   */
  const addBookmark = useAddBookmark({
    mutation: {
      retry: false,
      onMutate: ({ data }) => applyOptimisticBookmark(data.problemId, true),
      onSuccess: () => {
        toast(BOOKMARK_ADDED_MESSAGE);
        void invalidateUnitLessons();
      },
      onError: (_error, { data }) => {
        setProblemBookmarkInCache(data.problemId, false);
        toast(BOOKMARK_ADD_FAILURE_MESSAGE);
      },
      onSettled: markProblemsStale,
    },
  });

  const deleteBookmark = useDeleteBookmark({
    mutation: {
      retry: false,
      onMutate: ({ data }) => applyOptimisticBookmark(data.problemId, false),
      onSuccess: () => {
        toast(BOOKMARK_REMOVED_MESSAGE);
        void invalidateUnitLessons();
      },
      onError: (_error, { data }) => {
        setProblemBookmarkInCache(data.problemId, true);
        toast(BOOKMARK_REMOVE_FAILURE_MESSAGE);
      },
      onSettled: markProblemsStale,
    },
  });

  const toggleBookmark = (problemId: number, isBookmarked: boolean) => {
    const mutation = isBookmarked ? deleteBookmark : addBookmark;

    mutation.mutate({ data: { problemId } });
  };

  return {
    toggleBookmark,
    isPending: addBookmark.isPending || deleteBookmark.isPending,
  };
}
