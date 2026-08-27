import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
} from '@/shared/api/@generated/friend-api/friend-api';
import {
  type FollowCountsResponse,
  type RecommendUserResponse,
} from '@/shared/api/@generated/model';
import {
  getGetRecommendedUsersQueryKey,
  useFollow,
} from '@/shared/api/@generated/social-api/social-api';

export function useFollowRecommendUser() {
  const queryClient = useQueryClient();

  return useFollow({
    mutation: {
      onMutate: async ({ userId }) => {
        await Promise.all([
          queryClient.cancelQueries({
            queryKey: getGetRecommendedUsersQueryKey(),
          }),

          queryClient.cancelQueries({
            queryKey: getGetFollowAndFollowingCountQueryKey(),
          }),
        ]);

        const previousRecommendedUsers = queryClient.getQueryData<RecommendUserResponse[]>(
          getGetRecommendedUsersQueryKey(),
        );
        const previousFollowCounts = queryClient.getQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
        );

        queryClient.setQueryData<RecommendUserResponse[]>(
          getGetRecommendedUsersQueryKey(),
          (prev) => {
            if (!prev) return prev;

            return prev.filter((user) => userId !== user.userId);
          },
        );

        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              followingCount: prev.followingCount + 1,
            };
          },
        );
        return { previousRecommendedUsers, previousFollowCounts };
      },

      onError: (error, _, context) => {
        //TODO: 에러 핸들링 로직 추가
        console.log(error, 'failed recommend friend follow');

        queryClient.setQueryData<RecommendUserResponse[]>(
          getGetRecommendedUsersQueryKey(),
          context?.previousRecommendedUsers,
        );

        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          context?.previousFollowCounts,
        );
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetRecommendedUsersQueryKey(),
          refetchType: 'none',
        });

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
        });
      },
    },
  });
}
