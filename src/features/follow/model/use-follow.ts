import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import type {
  FollowCountsResponse,
} from '@/shared/api/@generated/model';
import type { SliceResponseFollowerResponse } from '@/shared/api/@generated/model/sliceResponseFollowerResponse';

// 팔로워 페이지에서 팔로우 요청을 보내는 훅
export function useFollow({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useFollowing({
    mutation: {
      onMutate: async ({ followeeId }) => {

        // 팔로워 목록 또는 팔로워 수 api 호출 중지
        await Promise.all([
          queryClient.cancelQueries({ queryKey: getGetFollowersInfiniteQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() }),
        ]);

        // 현재 팔로잉 목록/수 저장
        const previousFollower = queryClient.getQueryData(getGetFollowersInfiniteQueryKey());
        const previousCount = queryClient.getQueryData(getGetFollowAndFollowingCountQueryKey());

        // 현재 팔로잉 목록에서 isFollowing 값 수정
        queryClient.setQueryData<InfiniteData<SliceResponseFollowerResponse>>(
          getGetFollowersInfiniteQueryKey(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contents: page.contents?.map((user) =>
                  user.id === followeeId ? { ...user, isFollowing: true } : user
                ),
              })),
            };
          },
        );

        // 팔로잉 수 1 증가
        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (old) => {
            if (!old) return old;
            return { ...old, followingCount: (old.followingCount ?? 0) + 1 };
          },
        );

        return { previousFollower, previousCount };
      },
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(getGetFollowersInfiniteQueryKey(), context?.previousFollower);
        queryClient.setQueryData(getGetFollowAndFollowingCountQueryKey(), context?.previousCount);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetFollowersInfiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowingsInfiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
      },
    },
  });
}
