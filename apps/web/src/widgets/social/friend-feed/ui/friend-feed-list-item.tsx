import type { FriendFeed } from '@/entities/friend-feed';
import { ProfileAvatar } from '@/entities/user';
import { CongratulateButton } from '@/features/friend-feed-congratulate';

interface FriendFeedListItemProps {
  feed: FriendFeed;
}

/** 친구 활동 피드 한 줄. 모바일은 닉네임/메시지를 나눠 보여주고, 데스크톱은 한 문장으로 합친다. */
export function FriendFeedListItem({ feed }: FriendFeedListItemProps) {
  const {
    feedId,
    actorNickname,
    actorProfileImgNumber,
    timeAgo,
    message,
    congratulated,
    canCongratulate,
  } = feed;

  return (
    <li className="flex items-center justify-between py-5 md:py-4 border-b border-divider-1 last:border-0 md:border-0">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <ProfileAvatar
          colorNumber={actorProfileImgNumber}
          className="size-[38px] shrink-0 md:size-12"
        />
        <div className="flex min-w-0 flex-col gap-1 md:flex-col-reverse md:gap-0.5">
          <div className="flex items-center gap-1 md:gap-[1.5px]">
            <span className="text-label1 text-text-1 md:hidden">{actorNickname}</span>
            <span className="text-caption1 text-text-4 md:text-label1">{timeAgo}</span>
          </div>
          <p className="truncate text-label2 text-text-3 md:hidden">{message}</p>
          <p className="hidden truncate text-heading2 text-text-2 md:block">
            {actorNickname}님이 {message}
          </p>
        </div>
      </div>

      <CongratulateButton
        feedId={feedId}
        congratulated={congratulated}
        canCongratulate={canCongratulate}
      />
    </li>
  );
}
