import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
} from '@/shared/api/generated/friend-api/friend-api';
import type { FollowCountsResponse, RecommendUserResponse } from '@/shared/api/generated/model';
import {
  getGetRecommendedUsersQueryKey,
  useFollow,
} from '@/shared/api/generated/social-api/social-api';

/**
 * 추천 친구 팔로우 mutation. 낙관적으로 추천 목록에서 해당 유저를 제거하고 팔로잉 수를 +1 한다.
 * 실패하면 스냅샷으로 롤백한다.
 *
 * 즉시 제거 방식을 쓰는 이유: 추천 응답에 isFollowing 필드가 없어 팔로우 상태를 카드에 지속 표시할
 * 수 없다. 카드를 남겨 토글하면 팔로우 모달 등 다른 곳에서 언팔로우했을 때 동기화되지 않아 stale 된다.
 */
export function useFollowRecommendedUser() {
  const queryClient = useQueryClient();

  return useFollow({
    mutation: {
      onMutate: async ({ userId }) => {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: getGetRecommendedUsersQueryKey() }),
          queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() }),
        ]);

        const previousRecommendedUsers = queryClient.getQueryData<RecommendUserResponse[]>(
          getGetRecommendedUsersQueryKey(),
        );
        const previousFollowCounts = queryClient.getQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
        );

        queryClient.setQueryData<RecommendUserResponse[]>(
          getGetRecommendedUsersQueryKey(),
          (prev) => prev?.filter((user) => user.userId !== userId),
        );
        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (prev) => (prev ? { ...prev, followingCount: prev.followingCount + 1 } : prev),
        );

        return { previousRecommendedUsers, previousFollowCounts };
      },

      onError: (_error, _variables, context) => {
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
        // 추천 목록은 낙관적으로 이미 제거했으므로 즉시 refetch 하지 않는다(다음 진입 시 갱신).
        queryClient.invalidateQueries({
          queryKey: getGetRecommendedUsersQueryKey(),
          refetchType: 'none',
        });
        queryClient.invalidateQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetFollowingsInfiniteQueryKey() });
      },
    },
  });
}
