import { useQueryClient } from '@tanstack/react-query';

import {
  getGetFollowAndFollowingCountQueryKey,
  useUnFollowing,
} from '@/shared/api/@generated/friend-api/friend-api';
import { getGetRecommendedUsersQueryKey } from '@/shared/api/@generated/social-api/social-api';
import { Button } from '@/shared/ui/button/Button';

interface UnFollowButtonProps {
  followeeId: number;
  onSuccess?: () => void;
}

function UnFollowButton({ followeeId, onSuccess }: UnFollowButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: unFollowing, isPending: isUnFollowingPending } = useUnFollowing({
    mutation: {
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
      onClick={() => unFollowing({ followeeId })}
      variant={'strokeGray'}
      disabled={isUnFollowingPending}
      size="custom"
      className="bg-bg-1 text-label2 md:text-body1-normal py-2 md:py-[6.5px] px-4 md:px-5 rounded-lg"
    >
      팔로우 취소
    </Button>
  );
}

export default UnFollowButton;
