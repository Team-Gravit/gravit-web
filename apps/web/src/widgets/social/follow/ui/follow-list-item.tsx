import { useState } from 'react';

import type { FollowType, FollowUser } from '@/entities/follow';
import { ProfileAvatar } from '@/entities/user';
import { FollowButton, UnFollowButton } from '@/features/follow';

interface FollowListItemProps {
  type: FollowType;
  user: FollowUser;
}

/** 팔로우 목록의 한 사람. 핸들은 모바일에서만 보인다(데스크톱 모달은 닉네임만). */
export function FollowListItem({ type, user }: FollowListItemProps) {
  const { handle, id, nickname, profileImgNumber } = user;

  // 팔로우/언팔 성공 시 목록 refetch 없이 이 행의 버튼만 즉시 바꾼다.
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  return (
    <li className="flex items-center justify-between px-4 py-5 md:px-6 md:py-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <ProfileAvatar colorNumber={profileImgNumber} className="size-[38px] shrink-0 md:size-12" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-label1 text-text-1 md:text-heading2">{nickname}</p>
          <span className="truncate text-label2 text-text-3 md:hidden">@{handle}</span>
        </div>
      </div>

      {isFollowing ? (
        <UnFollowButton followeeId={id} onSuccess={() => setIsFollowing(false)} />
      ) : (
        <FollowButton
          followeeId={id}
          isFollower={type === 'followers'}
          onSuccess={() => setIsFollowing(true)}
        />
      )}
    </li>
  );
}
