import type { ReactNode } from 'react';

import { useRecommendedUsersQuery } from '@/entities/friend-recommendation';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { useSessionFollowState } from '@/shared/lib/use-session-follow-state';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';

import { RecommendFriendCard } from './recommend-friend-card';

/** 추천 친구 섹션. 가로 스크롤로 추천 목록을 보여준다. */
export function SocialRecommendFriendSection() {
  const {
    data: recommendedUsers,
    isPending,
    isError,
    refetch,
    dataUpdatedAt,
  } = useRecommendedUsersQuery();
  const { isFollowing, markFollowed, markUnfollowed } = useSessionFollowState(dataUpdatedAt);
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  let body: ReactNode;
  if (isError) {
    body = (
      <CardRetryStatus
        className="py-10"
        sectionName="추천 친구"
        onRetry={() => refetch({ throwOnError: true })}
      />
    );
  } else if (isPending) {
    body = <RecommendFriendsSkeleton isHidden={!showSkeleton} />;
  } else if (!recommendedUsers || recommendedUsers.length === 0) {
    body = (
      <p className="text-label1 text-text-4 md:text-heading1 text-center pt-14.5 pb-18.5 md:pt-19.25 md:pb-27">
        비슷한 레벨의 학습자들을 <br /> 찾지 못했어요
      </p>
    );
  } else {
    body = (
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
    );
  }

  return (
    <Card
      aria-busy={isPending || undefined}
      className="gap-4 p-4 shadow-elevation-1 md:gap-6 md:bg-bg-1 md:px-8 md:py-7"
    >
      <div className="flex flex-col gap-1">
        <p className="text-label2 text-text-4 md:text-body1-normal">추천 친구</p>
        <p className="text-headline2 text-text-2 md:text-title3 md:text-text-1">
          비슷한 레벨의 학습자들
        </p>
      </div>

      <ScrollArea orientation="horizontal" className="flex-1">
        {body}
      </ScrollArea>
    </Card>
  );
}

/** 추천 친구 카드 로딩 스켈레톤(row 5개, 가로). */
function RecommendFriendsSkeleton({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <SkeletonReserve isHidden={isHidden} className="flex items-stretch gap-2 md:gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex w-[144px] shrink-0 flex-col items-center gap-3 rounded-6 bg-bg-1 px-5 py-3 md:w-[250px] md:rounded-8 md:border md:border-divider-1 md:p-8"
        >
          <div className="flex flex-col items-center gap-3 md:gap-3">
            <Skeleton variant="circular" className="size-[52px] md:size-20" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton variant="text" className="w-20 text-label1 md:text-heading2" />
              <Skeleton variant="text" className="w-24 text-caption1 md:text-body1-normal" />
            </div>
          </div>
          <Skeleton variant="block" className="h-8 w-[102px] rounded-8 md:h-9" />
        </div>
      ))}
    </SkeletonReserve>
  );
}
