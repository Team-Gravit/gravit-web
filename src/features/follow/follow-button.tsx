import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  useFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import { getGetRecommendedUsersQueryKey } from '@/shared/api/@generated/social-api/social-api';
import { Button } from '@/shared/ui/button/Button';

interface FollowButtonProps {
  isFollower: boolean;
  followeeId: number;
  onSuccess?: () => void;
}

function FollowButton({ isFollower, followeeId, onSuccess }: FollowButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending: isFollowPending } = useFollowing({
    mutation: {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: getGetFollowAndFollowingCountQueryKey() });
      },
      onSuccess: () => {
        onSuccess?.();

        queryClient.invalidateQueries({
          queryKey: getGetFollowAndFollowingCountQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetRecommendedUsersQueryKey(),
        });
      },
    },
  });

  return (
    <Button
      onClick={() => follow({ followeeId })}
      disabled={isFollowPending}
      size="custom"
      className="text-label2 md:text-body1-normal rounded-lg px-4 md:px-5 py-2 md:py-[6.5px]"
    >
      {isFollower ? '맞팔로우' : '팔로우'}
    </Button>
  );
}

export default FollowButton;