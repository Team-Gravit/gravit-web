import { Button } from '@/shared/ui/button';
import { useUnfollowUser } from '../api/use-unfollow-user';

interface UnFollowButtonProps {
  followeeId: number;
  onSuccess?: () => void;
}

export function UnFollowButton({ followeeId, onSuccess }: UnFollowButtonProps) {
  const { mutate: unfollow, isPending } = useUnfollowUser({ onSuccess });

  return (
    <Button
      type="button"
      variant={'stroke-secondary'}
      size="sm"
      onClick={() => unfollow({ followeeId })}
      disabled={isPending}
      className="shrink-0 rounded-8 border border-divider-2 bg-bg-1 px-4 py-2 text-label2 text-text-3 disabled:opacity-50"
    >
      팔로우 취소
    </Button>
  );
}
