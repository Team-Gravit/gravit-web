import { useState } from 'react';

import { useFriendFeedQuery } from '@/entities/friend-feed';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';
import { Card, CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll';

import { FriendFeedListItem } from './friend-feed-list-item';

const EMPTY_MESSAGE = '아직 활동한 친구가 없어요.\n더 많은 사용자들과 친구가 되어 보세요!';

/** 팔로잉한 친구들의 최근 활동 피드 섹션. 무한스크롤로 조회한다. */
export function SocialFriendsFeedSection() {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const { query, feeds } = useFriendFeedQuery();

  const loadMoreRef = useInfiniteScroll({
    root: viewport,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  if (query.isPending) {
    return null;
  }

  // 받아 둔 피드가 있으면 다음 페이지 · 재조회가 실패해도 목록을 그대로 둔다.
  const hasLoadError = query.isError && !query.data;

  return (
    <Card className="gap-4 p-4 shadow-elevation-1 md:gap-6 md:bg-bg-1 md:px-8 md:py-7">
      <div className="flex flex-col gap-2 md:gap-1">
        <p className="text-label2 text-text-4 md:text-body1-normal">친구 활동</p>
        <p className="text-headline2 text-text-2 md:text-title3 md:text-text-1">
          팔로잉한 친구들의 최근 성취
        </p>
      </div>

      {hasLoadError && (
        <CardRetryStatus
          sectionName="친구 활동"
          className="min-h-[150px]"
          onRetry={() => query.refetch({ throwOnError: true })}
        />
      )}
      {!hasLoadError && feeds.length > 0 && (
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
      )}
      {!hasLoadError && feeds.length === 0 && (
        <CardStatus message={EMPTY_MESSAGE} className="min-h-[150px] whitespace-pre-line" />
      )}
    </Card>
  );
}
