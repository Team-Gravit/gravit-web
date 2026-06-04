import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useUnFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import type {
  FollowCountsResponse,
  SliceResponseFollowingResponse,
} from '@/shared/api/@generated/model';
import type { SliceResponseFollowerResponse } from '@/shared/api/@generated/model/sliceResponseFollowerResponse';

export function useUnfollow({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useUnFollowing({
    mutation: {
      onMutate: async ({ followeeId }) => {

        // 팔로잉 목록과 팔로워 목록, 팔로워 수 패칭 api를 중단
        await Promise.all([
          queryClient.cancelQueries({ queryKey: getGetFollowingsInfiniteQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowersInfiniteQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() }),
        ]);

        //  현재 팔로잉 수와 현재 팔로잉 목록/팔로워 목록 저장
        const previousFollowings = queryClient.getQueryData(getGetFollowingsInfiniteQueryKey());
        const previousFollowers = queryClient.getQueryData(getGetFollowersInfiniteQueryKey());
        const previousCount = queryClient.getQueryData(getGetFollowAndFollowingCountQueryKey());

        // 팔로잉 목록에서 언팔로우가 눌린 유저를 제거
        queryClient.setQueryData<InfiniteData<SliceResponseFollowingResponse>>(
          getGetFollowingsInfiniteQueryKey(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contents: page.contents?.filter((user) => user.id !== followeeId),
              })),
            };
          },
        );

        // 팔로워 목록에서 언팔로우 누른 유저와의 관계 변경
        queryClient.setQueryData<InfiniteData<SliceResponseFollowerResponse>>(
          getGetFollowersInfiniteQueryKey(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contents: page.contents?.map((user)=> user.id === followeeId ? {...user,isFollowing: false} : user),
              })),
            };
          },
        );

        // 팔로잉 수를 1 감소
        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (old) => {
            if (!old) return old;
            return { ...old, followingCount: (old.followingCount ?? 0) - 1 };
          },
        );

        return { previousFollowings, previousFollowers, previousCount };
      },
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(getGetFollowingsInfiniteQueryKey(), context?.previousFollowings);
        queryClient.setQueryData(getGetFollowersInfiniteQueryKey(), context?.previousFollowers);
        queryClient.setQueryData(getGetFollowAndFollowingCountQueryKey(), context?.previousCount);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetFollowingsInfiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowersInfiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
      },
    },
  });
}
