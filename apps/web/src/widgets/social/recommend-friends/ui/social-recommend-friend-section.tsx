import { useRecommendedUsersQuery } from '@/entities/friend-recommendation';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll';

import { useSessionFollowState } from '../model/use-session-follow-state';
import { RecommendFriendCard } from './recommend-friend-card';

/** 추천 친구 섹션. 가로 스크롤로 추천 목록을 보여준다. */
export function SocialRecommendFriendSection() {
  const { data: recommendedUsers, isPending, dataUpdatedAt } = useRecommendedUsersQuery();
  const { isFollowing, markFollowed, markUnfollowed } = useSessionFollowState(dataUpdatedAt);

  if (isPending || !recommendedUsers) {
    return null;
  }

  return (
    <Card className="gap-4 p-4 shadow-elevation-1 md:gap-6 md:bg-bg-1 md:px-8 md:py-7">
      <div className="flex flex-col gap-1">
        <p className="text-label2 text-text-4 md:text-body1-normal">추천 친구</p>
        <p className="text-headline2 text-text-2 md:text-title3 md:text-text-1">
          비슷한 레벨의 학습자들
        </p>
      </div>

      <ScrollArea orientation="horizontal" className="flex-1">
        {recommendedUsers.length > 0 ? (
          <ul className="flex items-stretch gap-2 md:gap-4">
            {recommendedUsers.map((user) => (
              <RecommendFriendCard
                key={user.userId}
                user={user}
                isFollowing={isFollowing(user.userId)}
                onFollowed={() => markFollowed(user.userId)}
                onUnfollowed={() => markUnfollowed(user.userId)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-label1 text-text-4 md:text-heading1 text-center pt-14.5 pb-18.5 md:pt-19.25 md:pb-27">
            비슷한 레벨의 학습자들을 <br /> 찾지 못했어요
          </p>
        )}
      </ScrollArea>
    </Card>
  );
}
