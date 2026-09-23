import { useState } from 'react';

import { useFriendFeedQuery } from '@/entities/friend-feed';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';
import { Card } from '@/shared/ui/card';
import { ScrollArea } from '@/shared/ui/scroll';

import { FriendFeedListItem } from './friend-feed-list-item';

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

  return (
    <Card className="gap-4 p-4 shadow-elevation-1 md:gap-6 md:bg-bg-1 md:px-8 md:py-7">
      <div className="flex flex-col gap-2 md:gap-1">
        <p className="text-label2 text-text-4 md:text-body1-normal">친구 활동</p>
        <p className="text-headline2 text-text-2 md:text-title3 md:text-text-1">
          팔로잉한 친구들의 최근 성취
        </p>
      </div>

      {feeds.length > 0 ? (
        <ScrollArea
          viewportRef={setViewport}
          className="max-h-[312px] md:max-h-[368px]"
          viewportClassName="md:pr-4"
        >
          <ul className="flex flex-col md:gap-4">
            {feeds.map((feed) => (
              <FriendFeedListItem key={feed.feedId} feed={feed} />
            ))}
            {query.hasNextPage && <li ref={loadMoreRef} className="h-4 shrink-0" aria-hidden />}
          </ul>
        </ScrollArea>
      ) : (
        <div className="flex min-h-[150px] items-center justify-center">
          <p className="text-center text-label1 text-text-4 md:text-heading1">
            아직 활동한 친구가 없어요.
            <br />더 많은 사용자들과 친구가 되어 보세요!
          </p>
        </div>
      )}
    </Card>
  );
}
