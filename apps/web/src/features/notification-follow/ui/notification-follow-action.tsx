import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import { useFollowFromNotification } from '../api/use-follow-from-notification';
import { useUnfollowFromNotification } from '../api/use-unfollow-from-notification';

interface NotificationFollowActionProps {
  /** 팔로우/언팔로우 대상 유저(actor.profileId). */
  userId: number;
  /** 캐시 기준 현재 팔로우 상태(actionType 파생). 토글 결과가 인박스 캐시에 반영되므로 이 값이 진실. */
  isFollowing: boolean;
  layout: 'card' | 'popover';
}

/**
 * FOLLOW 알림의 맞팔로우 ↔ 팔로우 취소 토글. 성공 시 mutation 이 인박스 캐시의 actionType 을
 * 갱신하고, 버튼은 그 캐시에서 파생한 `isFollowing` 으로 그린다(로컬 상태 없음 → 재오픈·재진입에도 일치).
 */
export function NotificationFollowAction({
  userId,
  isFollowing,
  layout,
}: NotificationFollowActionProps) {
  const { mutate: follow, isPending: isFollowPending } = useFollowFromNotification();
  const { mutate: unfollow, isPending: isUnfollowPending } = useUnfollowFromNotification();

  const sizeClass =
    layout === 'popover' ? 'h-[37px] px-5 text-body1-normal' : 'h-8 px-4 text-label2';
  const isPending = isFollowPending || isUnfollowPending;

  if (isFollowing) {
    // 취소: 데스크톱은 회색 stroke(맞팔로우 취소), 모바일은 보라 stroke(팔로우 취소) — 시안.
    return (
      <Button
        type="button"
        variant={layout === 'popover' ? 'stroke-secondary' : 'stroke-default'}
        size="sm"
        disabled={isPending}
        onClick={() => unfollow({ followeeId: userId })}
        className={cn('w-full', sizeClass)}
      >
        {layout === 'popover' ? '맞팔로우 취소' : '팔로우 취소'}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="default"
      size="sm"
      disabled={isPending}
      onClick={() => follow({ userId })}
      className={cn('w-full', sizeClass)}
    >
      맞팔로우
    </Button>
  );
}
