import { useState } from 'react';

import type FollowUser from '@/entities/follow/model/types';
import type { FollowType } from '@/entities/follow/model/types';
import Profile from '@/entities/user/ui/profile';
import FollowButton from '@/features/follow/ui/follow-button';
import UnFollowButton from '@/features/follow/ui/unfollow-button';

interface FollowListItemProps {
  type: FollowType;
  user: FollowUser;
}

function FollowListItem({ user, type }: FollowListItemProps) {
  const { handle, id, nickname, profileImgNumber, isFollowing } = user;

  const [currentFollowingState, setCurrentFollowingState] = useState(isFollowing);

  return (
    <li className="flex items-center justify-between px-6 py-3">
      <div className="flex gap-3 items-center">
        <Profile profileImgId={profileImgNumber} size="sm" />
        <div className="flex flex-col gap-1">
          <p className="text-text-1 text-label1 md:text-heading2">{nickname}</p>
          <span className="text-label2 text-text-3 md:hidden">{`@${handle}`}</span>
        </div>
      </div>

      {currentFollowingState ? (
        <UnFollowButton
          followeeId={id}
          onSuccess={() => {
            setCurrentFollowingState(false);
          }}
        />
      ) : (
        <FollowButton
          isFollower={type === 'followers'}
          followeeId={id}
          onSuccess={() => {
            setCurrentFollowingState(true);
          }}
        />
      )}
    </li>
  );
}

export default FollowListItem;
