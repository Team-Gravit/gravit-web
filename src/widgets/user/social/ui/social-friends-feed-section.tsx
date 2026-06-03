import * as ScrollArea from '@radix-ui/react-scroll-area';
import type { InfiniteData } from '@tanstack/react-query';
import { Fragment, useCallback, useState } from 'react';

import type { FriendActivityFeed, FriendActivityFeedList } from '@/entities/friends/model/types';
import FriendFeedListItem from '@/features/friends/friend-feed-list-item';
import { useGetFeedInfinite } from '@/shared/api/@generated/social-api/social-api';
import { useInfiniteScroll } from '@/shared/model/use-infinite-scroll';
import SectionCard from '@/shared/ui/card/section-card';

type FeedInfiniteResponse = InfiniteData<FriendActivityFeedList, number | undefined>;

export default function SocialFriendsFeedSection() {
  const [viewportEl, setViewportEl] = useState<HTMLDivElement | null>(null);
  const handleViewportRef = useCallback((node: HTMLDivElement | null) => {
    setViewportEl(node);
  }, []);

  const {
    data: friendFeedData,
    isPending: isGetFriendFeedPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFeedInfinite<FeedInfiniteResponse>(
    { page: 0 },
    {
      query: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
      },
    },
  );

  const friendFeeds = friendFeedData?.pages.flatMap((page) => page.contents ?? []) ?? [];

  const loadMoreRef = useInfiniteScroll({
    root: viewportEl,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isGetFriendFeedPending || !friendFeedData) return null;

  return (
    <SectionCard
      title="친구 활동"
      description="팔로잉한 친구들의 최근 성취"
      className="gap-4 md:gap-6"
    >
      <ScrollArea.Root className="max-h-[312px] overflow-hidden md:-mr-6 md:max-h-[368px]">
        <ScrollArea.Viewport
          ref={handleViewportRef}
          className="max-h-[312px] w-full md:max-h-[368px] md:pr-4"
        >
          {friendFeeds.length > 0 ? (
            <>
              <FriendsFeedList feeds={friendFeeds} />

              {hasNextPage && <div ref={loadMoreRef} className="h-4 shrink-0" aria-hidden />}
            </>
          ) : (
            // TODO : Fallback UI 요청
            <div className="min-h-[150px] flex items-center justify-center">
              <p className="text-text-4 text-label1 md:text-heading2">최근 친구 활동이 없습니다</p>
            </div>
          )}
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-5 touch-none select-none px-[7px]"
        >
          <ScrollArea.Thumb className="hidden md:block relative flex-1 rounded-full bg-gray-400" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </SectionCard>
  );
}

function FriendsFeedList({ feeds }: { feeds: FriendActivityFeed[] }) {
  return (
    <ul className="flex flex-col md:gap-4">
      {feeds.map((feed, idx) => (
        <Fragment key={feed.feedId}>
          <FriendFeedListItem feed={feed} />

          {idx < feeds.length - 1 && (
            <div aria-hidden className="min-h-px w-full bg-divider-1 md:hidden" />
          )}
        </Fragment>
      ))}
    </ul>
  );
}
