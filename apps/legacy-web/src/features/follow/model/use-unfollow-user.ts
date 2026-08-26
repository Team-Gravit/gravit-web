import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useUnFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';

interface useUnfollowUserProps {
  onSuccess?: () => void;
}
export function useUnfollowUser({ onSuccess }: useUnfollowUserProps) {
  const queryClient = useQueryClient();

  return useUnFollowing({
    mutation: {
      onSuccess: () => {
        onSuccess?.();

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetFollowingsInfiniteQueryKey(),
          refetchType: 'none',
        });
      },
    },
  });
}
