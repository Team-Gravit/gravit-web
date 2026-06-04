import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useUnFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import type {
  FollowCountsResponse,
  SliceResponseFollowingResponse,
} from '@/shared/api/@generated/model';

export function useUnfollow({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useUnFollowing({
    mutation: {
      onMutate: async ({ followeeId }) => {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: getGetFollowingsInfiniteQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() }),
        ]);

        const previousFollowings = queryClient.getQueryData(getGetFollowingsInfiniteQueryKey());
        const previousCount = queryClient.getQueryData(getGetFollowAndFollowingCountQueryKey());

        queryClient.setQueryData<InfiniteData<SliceResponseFollowingResponse>>(
          getGetFollowingsInfiniteQueryKey(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contents: page.contents.filter((user) => user.id !== followeeId),
              })),
            };
          },
        );

        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (old) => {
            if (!old) return old;
            return { ...old, followingCount: (old.followingCount ?? 0) - 1 };
          },
        );

        return { previousFollowings, previousCount };
      },
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(getGetFollowingsInfiniteQueryKey(), context?.previousFollowings);
        queryClient.setQueryData(getGetFollowAndFollowingCountQueryKey(), context?.previousCount);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetFollowingsInfiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
      },
    },
  });
}
