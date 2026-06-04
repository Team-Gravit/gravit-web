import { Button } from '@/shared/ui/button/Button';

import { useUnfollow } from './model/use-unfollow';

interface UnFollowButtonProps {
  followeeId: number;
  onSuccess?: () => void;
}

function UnFollowButton({ followeeId, onSuccess }: UnFollowButtonProps) {
  const { mutate: unfollow, isPending } = useUnfollow({ onSuccess });

  return (
    <Button
      onClick={() => unfollow({ followeeId })}
      variant="strokeGray"
      disabled={isPending}
      size="custom"
      className="text-label2 md:text-body1-normal py-2 md:py-[6.5px] px-4 md:px-5 rounded-lg"
    >
      팔로우 취소
    </Button>
  );
}

export default UnFollowButton;
