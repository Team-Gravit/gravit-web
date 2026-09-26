import { useQueryClient } from '@tanstack/react-query';

import {
  useAddBookmark,
  useDeleteBookmark,
} from '@/shared/api/generated/bookmark-api/bookmark-api';
import type { LessonResponse } from '@/shared/api/generated/model';
import { getGetAllProblemInLessonQueryKey } from '@/shared/api/generated/problem-api/problem-api';
import { toast } from '@/shared/ui/toast';

import {
  BOOKMARK_ADD_FAILURE_MESSAGE,
  BOOKMARK_ADDED_MESSAGE,
  BOOKMARK_REMOVE_FAILURE_MESSAGE,
  BOOKMARK_REMOVED_MESSAGE,
} from '../model/constants';

interface UseToggleProblemBookmarkOptions {
  /** 갱신할 레슨 문제 캐시의 ID. */
  lessonId: number;
}

/** 레슨 문제 캐시를 먼저 갱신하고 요청이 실패하면 북마크 상태를 되돌린다. */
export function useToggleProblemBookmark({ lessonId }: UseToggleProblemBookmarkOptions) {
  const queryClient = useQueryClient();
  const lessonProblemsQueryKey = getGetAllProblemInLessonQueryKey(lessonId);

  const setProblemBookmarkInCache = (problemId: number, isBookmarked: boolean) => {
    queryClient.setQueryData<LessonResponse>(
      lessonProblemsQueryKey,
      (lesson) =>
        lesson && {
          ...lesson,
          problems: lesson.problems.map((problem) =>
            problem.problemId === problemId ? { ...problem, isBookmarked } : problem,
          ),
        },
    );
  };

  const applyOptimisticBookmark = async (problemId: number, isBookmarked: boolean) => {
    // 낙관적 갱신 전 기존 조회 취소
    await queryClient.cancelQueries({ queryKey: lessonProblemsQueryKey, exact: true });
    setProblemBookmarkInCache(problemId, isBookmarked);
  };

  // 레슨 문제 캐시가 stale 상태임을 표시
  const markLessonProblemsStale = () =>
    queryClient.invalidateQueries({
      queryKey: lessonProblemsQueryKey,
      exact: true,
      // 즉시 재조회하지 않고, 현재 화면은 낙관적 상태를 유지한다. 다음 조회에서 서버 상태를 확인한다.
      refetchType: 'none',
    });

  /**
   * mutation의 생명주기: onMutate ⭢ 실제 API 요청 ⭢ onSuccess 또는 onError ⭢ onSettled
   */
  const addBookmark = useAddBookmark({
    mutation: {
      retry: false,
      onMutate: ({ data }) => applyOptimisticBookmark(data.problemId, true),
      onSuccess: () => toast(BOOKMARK_ADDED_MESSAGE),
      onError: (_error, { data }) => {
        setProblemBookmarkInCache(data.problemId, false);
        toast(BOOKMARK_ADD_FAILURE_MESSAGE);
      },
      onSettled: markLessonProblemsStale,
    },
  });

  const deleteBookmark = useDeleteBookmark({
    mutation: {
      retry: false,
      onMutate: ({ data }) => applyOptimisticBookmark(data.problemId, false),
      onSuccess: () => toast(BOOKMARK_REMOVED_MESSAGE),
      onError: (_error, { data }) => {
        setProblemBookmarkInCache(data.problemId, true);
        toast(BOOKMARK_REMOVE_FAILURE_MESSAGE);
      },
      onSettled: markLessonProblemsStale,
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
