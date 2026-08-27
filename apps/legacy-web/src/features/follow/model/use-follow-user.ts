import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import { getGetRecommendedUsersQueryKey } from '@/shared/api/@generated/social-api/social-api';

interface useFollowUserProps {
  onSuccess?: () => void;
}

function useFollowUser({ onSuccess }: useFollowUserProps) {
  const queryClient = useQueryClient();

  return useFollowing({
    mutation: {
      onSuccess: () => {
        onSuccess?.();

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetRecommendedUsersQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
          refetchType: 'none',
        });
      },
    },
  });
}

export default useFollowUser;
