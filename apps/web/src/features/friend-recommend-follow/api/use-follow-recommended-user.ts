import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
} from '@/shared/api/generated/friend-api/friend-api';
import type { FollowCountsResponse } from '@/shared/api/generated/model';
import {
  getGetRecommendedUsersQueryKey,
  useFollow,
} from '@/shared/api/generated/social-api/social-api';

/**
 * 추천 친구 팔로우 mutation. 카드는 목록에 유지하고(추천 위젯의 세션 로컬 set 이 버튼을 토글),
 * 낙관적으로 팔로잉 수만 +1 한다. 실패하면 스냅샷으로 롤백한다.
 *
 * 추천 응답에 isFollowing 이 없어 팔로우 상태를 서버 데이터로 표현할 수 없다. 그래서 카드를
 * 제거하지 않고 세션 로컬 set(use-session-follow-state)으로 표시한다. 서버가 isFollowing 을
 * 제공하면 로컬 set 을 제거하고 캐시 기반으로 단순화할 수 있다.
 */
export function useFollowRecommendedUser() {
  const queryClient = useQueryClient();

  return useFollow({
    mutation: {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });

        const previousFollowCounts = queryClient.getQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
        );

        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          (prev) => (prev ? { ...prev, followingCount: prev.followingCount + 1 } : prev),
        );

        return { previousFollowCounts };
      },

      onError: (_error, _variables, context) => {
        queryClient.setQueryData<FollowCountsResponse>(
          getGetFollowAndFollowingCountQueryKey(),
          context?.previousFollowCounts,
        );
      },

      onSettled: () => {
        // 추천 목록은 카드를 유지하므로 즉시 refetch 하지 않는다(다음 진입·모달 언팔로우 시 갱신).
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
