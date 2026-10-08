import { Button } from '@/shared/ui/button';
import { useFollowUser } from '../api/use-follow-user';

interface FollowButtonProps {
  followeeId: number;
  /** 상대가 나를 팔로우 중이면(팔로워 목록) "맞팔로우"로 표기한다. */
  isFollower: boolean;
  onSuccess?: () => void;
}

export function FollowButton({ followeeId, isFollower, onSuccess }: FollowButtonProps) {
  const { mutate: follow, isPending } = useFollowUser({ onSuccess });

  return (
    <Button
      type="button"
      onClick={() => follow({ followeeId })}
      disabled={isPending}
      size="sm"
      className="shrink-0 rounded-8 bg-cta px-4 py-2 text-label2 text-cta-text disabled:opacity-50"
    >
      {isFollower ? '맞팔로우' : '팔로우'}
    </Button>
  );
}
