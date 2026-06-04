import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowersInfiniteQueryKey,
  useFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import type {
  FollowCountsResponse,
  SliceResponseFollowingResponse,
} from '@/shared/api/@generated/model';

export function useFollow({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  return useFollowing({
    mutation: {
      onMutate: async ({ followeeId }) => {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: getGetFollowersInfiniteQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() }),
        ]);

        const previousFollower = queryClient.getQueryData(getGetFollowersInfiniteQueryKey());
        const previousCount = queryClient.getQueryData(getGetFollowAndFollowingCountQueryKey());

        queryClient.setQueryData<InfiniteData<SliceResponseFollowingResponse>>(
          getGetFollowersInfiniteQueryKey(),
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
        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
      },
    },
  });
}
