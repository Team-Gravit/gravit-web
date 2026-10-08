import type { RecommendedUser } from '@/entities/friend-recommendation';
import { ProfileAvatar } from '@/entities/user';
import { UnFollowButton } from '@/features/follow';
import { RecommendFollowButton } from '@/features/friend-recommend-follow';

interface RecommendFriendCardProps {
  user: RecommendedUser;
  isFollowing: boolean;
  onFollowed: () => void;
  onUnfollowed: () => void;
}

/** 추천 친구 한 명 카드. 팔로우해도 카드는 유지되고 버튼만 팔로우↔팔로잉으로 토글된다. */
export function RecommendFriendCard({
  user,
  isFollowing,
  onFollowed,
  onUnfollowed,
}: RecommendFriendCardProps) {
  const { userId, nickname, profileImgNumber, mutualFollowCount } = user;

  return (
    <li className="flex w-[144px] shrink-0 flex-col items-center gap-4 rounded-6 bg-bg-1 px-5 py-3 md:w-[250px] md:rounded-8 md:border md:border-divider-1 md:p-8">
      <div className="flex flex-col items-center gap-2 md:gap-3">
        <ProfileAvatar colorNumber={profileImgNumber} className="size-[52px] md:size-20" />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-label1 text-text-1 md:text-heading2">{nickname}</p>
          <p className="text-caption1 text-text-4 md:text-body1-normal md:text-text-3">
            함께 아는 친구 {mutualFollowCount}명
          </p>
        </div>
      </div>

      {isFollowing ? (
        <UnFollowButton followeeId={userId} onSuccess={onUnfollowed} />
      ) : (
        <RecommendFollowButton userId={userId} onFollowed={onFollowed} />
      )}
    </li>
  );
}
