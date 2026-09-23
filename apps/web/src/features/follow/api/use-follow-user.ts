import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useFollow1,
} from '@/shared/api/generated/friend-api/friend-api';
import type { RecommendUserResponse } from '@/shared/api/generated/model';
import { getGetRecommendedUsersQueryKey } from '@/shared/api/generated/social-api/social-api';

interface UseFollowUserProps {
  onSuccess?: () => void;
}

/** 팔로우 mutation. 성공 시 팔로우 수와 팔로잉 목록 캐시를 무효화한다. */
export function useFollowUser({ onSuccess }: UseFollowUserProps = {}) {
  const queryClient = useQueryClient();

  return useFollow1({
    mutation: {
      onSuccess: (_, { followeeId }) => {
        onSuccess?.();

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });

        // 팔로우 변경은 두 목록(팔로워/팔로잉)의 isFollowing 에 영향을 준다.
        // 열려 있는 목록을 즉시 흔들지 않도록 stale 표시만 하고, 재진입 시 refetch 되게 둔다.
        queryClient.invalidateQueries({
          queryKey: getGetFollowersInfiniteQueryKey(),
          refetchType: 'none',
        });
        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
          refetchType: 'none',
        });

        // 팔로우한 사람은 더 이상 추천 대상이 아니므로 추천 캐시에서 직접 제거한다.
        // 무효화 후 refetch 대신 setQueryData 로 빼면 추가 요청 없이 즉시 반영된다.
        queryClient.setQueryData<RecommendUserResponse[]>(
          getGetRecommendedUsersQueryKey(),
          (prev) => prev?.filter((user) => user.userId !== followeeId),
        );
      },
    },
  });
}
