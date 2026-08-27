import useResponsive from '@/shared/model/use-responsive';
import { Button } from '@/shared/ui/button/Button';

import useFollowUser from '../model/use-follow-user';

interface FollowButtonProps {
  isFollower: boolean;
  followeeId: number;
  onSuccess?: () => void;
}

function FollowButton({ isFollower, followeeId, onSuccess }: FollowButtonProps) {
  const { isMobile } = useResponsive();

  const { mutate: follow, isPending: isFollowPending } = useFollowUser({ onSuccess });

  return (
    <Button
      onClick={() => follow({ followeeId })}
      disabled={isFollowPending}
      size={isMobile ? 'sm' : 'md'}
      className="text-label2 md:text-body1-normal"
    >
      {isFollower ? '맞팔로우' : '팔로우'}
    </Button>
  );
}

export default FollowButton;
