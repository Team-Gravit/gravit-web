import { useAutoAnimate } from '@formkit/auto-animate/react';

import type { RecommendUser } from '@/entities/friends/model/types';
import Profile from '@/entities/user/ui/profile';
import RecommendFriendFollowButton from '@/features/follow/ui/recommend-friend-follow-button';
import type { RecommendUserResponse } from '@/shared/api/@generated/model';
import { useGetRecommendedUsers } from '@/shared/api/@generated/social-api/social-api';
import SectionCard from '@/shared/ui/card/section-card';
import ScrollArea from '@/shared/ui/scroll/scroll-area';

function SocialRecommendFriendSection() {
  const [listRef] = useAutoAnimate();

  // TODO : API response 타입 단일 데이터로 되어있음
  const { data: recommendFriends, isPending: isGetRecommendFriendsPending } =
    useGetRecommendedUsers<RecommendUserResponse[]>();

  if (isGetRecommendFriendsPending || !recommendFriends) return null;

  return (
    <SectionCard
      title="추천 친구"
      description="비슷한 레벨의 학습자들"
      className="gap-4 md:gap-[34px]"
    >
      <ScrollArea orientation="horizontal">
        <ul ref={listRef} className="flex items-center gap-4 -mr-8 pr-8  scrollbar-hide">
          {recommendFriends.map((recommendFriend) => (
            <RecommendFriendListItem
              recommendFriend={recommendFriend}
              key={recommendFriend.userId}
            />
          ))}
        </ul>
      </ScrollArea>
    </SectionCard>
  );
}

export default SocialRecommendFriendSection;

function RecommendFriendListItem({ recommendFriend }: { recommendFriend: RecommendUser }) {
  const { mutualFollowCount, nickname, profileImgNumber, userId } = recommendFriend;

  return (
    <li className="bg-bg-2 md:bg-bg-1 flex flex-col items-center justify-between min-w-[144px] md:min-w-[250px] min-h-[160px] md:min-h-[267px] py-3 md:py-8 md:border md:border-divider-1 rounded-lg">
      <div className="flex flex-col items-center justify-center gap-2 md:gap-3 mb-4">
        <Profile profileImgId={profileImgNumber} size="md" />
        <div className="text-center">
          <p className="text-label1 md:text-heading2 text-text-1 mb-1">{nickname}</p>

          {/* TODO : mutualFriend 필드 추가 시 하드코딩 된 더미 텍스트 제거 */}
          {mutualFollowCount > 0 && (
            <div className="text-caption1 md:text-body1-normal text-text-3">{`내이름님 외${mutualFollowCount}명`}</div>
          )}
        </div>
      </div>

      <RecommendFriendFollowButton userId={userId} />
    </li>
  );
}
