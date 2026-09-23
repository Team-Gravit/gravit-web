import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useUnfollow,
} from '@/shared/api/generated/friend-api/friend-api';

interface UseUnfollowUserProps {
  onSuccess?: () => void;
}

/** 언팔로우 mutation. 성공 시 팔로우 수와 팔로잉 목록 캐시를 무효화한다. */
export function useUnfollowUser({ onSuccess }: UseUnfollowUserProps = {}) {
  const queryClient = useQueryClient();

  return useUnfollow({
    mutation: {
      onSuccess: () => {
        onSuccess?.();

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });

        // 언팔로우는 두 목록(팔로워/팔로잉)의 isFollowing 에 영향을 준다.
        // 열려 있는 목록을 즉시 흔들지 않도록 stale 표시만 하고, 재진입 시 refetch 되게 둔다.
        queryClient.invalidateQueries({
          queryKey: getGetFollowersInfiniteQueryKey(),
          refetchType: 'none',
        });
        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
          refetchType: 'none',
        });
      },
    },
  });
}
