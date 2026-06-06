import { useState } from 'react';

import type { Following, FollowType } from '@/entities/follow/model/types';
import Profile from '@/entities/user/ui/profile';
import FollowButton from '@/features/follow/follow-button';
import UnFollowButton from '@/features/follow/unfollow-button';

interface FollowListItemProps {
  type: FollowType;
  user: Following;
}

function FollowListItem({ user, type }: FollowListItemProps) {
  const { handle, id, nickname, profileImgNumber } = user;

  const [isFollowing, setIsFollowing] = useState(
    type === 'following' ? true : (user.isFollowing ?? false),
  );
  return (
    <li className="flex items-center justify-between px-6 py-3">
      <div className="flex gap-3 items-center">
        <Profile profileImgId={profileImgNumber} size="sm" />
        <div className="flex flex-col gap-1">
          <p className="text-text-1 text-label1 md:text-heading2">{nickname}</p>
          <span className="text-label2 text-text-3 md:hidden">{`@${handle}`}</span>
        </div>
      </div>

      {isFollowing ? (
        <UnFollowButton followeeId={id} onSuccess={() => setIsFollowing(false)} />
      ) : (
        <FollowButton type={type} followeeId={id} onSuccess={() => setIsFollowing(true)} />
      )}
    </li>
  );
}

export default FollowListItem;
