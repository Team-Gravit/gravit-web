import useResponsive from '@/shared/model/use-responsive';
import { Button } from '@/shared/ui/button/Button';

import { useUnfollowUser } from '../model/use-unfollow-user';

interface UnFollowButtonProps {
  followeeId: number;
  onSuccess?: () => void;
}

function UnFollowButton({ followeeId, onSuccess }: UnFollowButtonProps) {
  const { isMobile } = useResponsive();

  const { mutate: unFollowing, isPending: isUnFollowingPending } = useUnfollowUser({ onSuccess });

  return (
    <Button
      onClick={() => unFollowing({ followeeId })}
      variant={'strokeGray'}
      disabled={isUnFollowingPending}
      size={isMobile ? 'sm' : 'md'}
      className="text-label2 md:text-body1-normal"
    >
      팔로우 취소
    </Button>
  );
}

export default UnFollowButton;
