import { useQueryClient } from '@tanstack/react-query';

import type { RecommendUser } from '@/entities/friends/model/types';
import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
} from '@/shared/api/@generated/friend-api/friend-api';
import type { FollowCountsResponse } from '@/shared/api/@generated/model';
import {
  getGetRecommendedUsersQueryKey,
  useFollow,
} from '@/shared/api/@generated/social-api/social-api';

export function useRecommendFollow() {
  const queryClient = useQueryClient();

  return useFollow({
    mutation: {
      onMutate: async ({ userId }) => {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: getGetRecommendedUsersQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() }),
        ]);

        const previousRecommendUsers = queryClient.getQueryData(getGetRecommendedUsersQueryKey());
        const previousCount = queryClient.getQueryData(getGetFollowAndFollowingCountQueryKey());

        queryClient.setQueryData<RecommendUser[]>(getGetRecommendedUsersQueryKey(), (old) =>
          old?.filter((user) => user.userId !== userId),
        );

        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (old) => {
            if (!old) return old;
            return { ...old, followingCount: (old.followingCount ?? 0) + 1 };
          },
        );

        return { previousRecommendUsers, previousCount };
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(getGetRecommendedUsersQueryKey(), context?.previousRecommendUsers);
        queryClient.setQueryData(getGetFollowAndFollowingCountQueryKey(), context?.previousCount);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetRecommendedUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowingsInfiniteQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
      },
    },
  });
}
