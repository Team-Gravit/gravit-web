import { useState, type ReactNode } from 'react';

import { useFriendFeedQuery } from '@/entities/friend-feed';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';
import { Card, CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';

import { FriendFeedListItem } from './friend-feed-list-item';

const EMPTY_MESSAGE = '아직 활동한 친구가 없어요.\n더 많은 사용자들과 친구가 되어 보세요!';

/** 팔로잉한 친구들의 최근 활동 피드 섹션. 무한스크롤로 조회한다. */
export function SocialFriendsFeedSection() {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const { query, feeds } = useFriendFeedQuery();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(query.isPending);

  const loadMoreRef = useInfiniteScroll({
    root: viewport,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  // 받아 둔 피드가 있으면 다음 페이지 · 재조회가 실패해도 목록을 그대로 둔다.
  const hasLoadError = query.isError && !query.data;

  let body: ReactNode;
  if (hasLoadError) {
    body = (
      <CardRetryStatus
        sectionName="최근 친구 활동"
        className="min-h-[150px]"
        onRetry={() => query.refetch({ throwOnError: true })}
      />
    );
  } else if (query.isPending) {
    body = <FriendFeedSkeleton isHidden={!showSkeleton} />;
  } else if (feeds.length === 0) {
    body = <CardStatus message={EMPTY_MESSAGE} className="min-h-[150px] whitespace-pre-line" />;
  } else {
    body = (
      <ScrollArea
        viewportRef={setViewport}
        className="max-h-[234px] md:max-h-[368px]"
        viewportClassName="pr-4 md:pr-6"
      >
        <ul className="flex flex-col md:gap-4">
          {feeds.map((feed) => (
            <FriendFeedListItem key={feed.feedId} feed={feed} />
          ))}
          {query.hasNextPage && <li ref={loadMoreRef} className="h-4 shrink-0" aria-hidden />}
        </ul>
      </ScrollArea>
    );
  }

  return (
    <Card
      aria-busy={query.isPending || undefined}
      className="gap-4 p-4 shadow-elevation-1 md:gap-6 md:bg-bg-1 md:px-8 md:py-7"
    >
      <div className="flex flex-col gap-2 md:gap-1">
        <p className="text-label2 text-text-4 md:text-body1-normal">친구 활동</p>
        <p className="text-headline2 text-text-2 md:text-title3 md:text-text-1">
          팔로잉한 친구들의 최근 성취
        </p>
      </div>
      {body}
    </Card>
  );
}

/** 친구 활동 목록 로딩 스켈레톤(row 2개). */
function FriendFeedSkeleton({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <SkeletonReserve isHidden={isHidden} className="flex flex-col">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 py-5 md:gap-6 md:py-4">
          <Skeleton variant="circular" className="size-[38px] shrink-0 md:size-12" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton variant="text" className="w-24 text-label1" />
            <Skeleton variant="text" className="w-40 text-label2 md:text-heading2" />
          </div>
        </div>
      ))}
    </SkeletonReserve>
  );
}
