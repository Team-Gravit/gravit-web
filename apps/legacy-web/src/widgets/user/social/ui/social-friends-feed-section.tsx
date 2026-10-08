import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Fragment, useCallback, useState } from 'react';

import type { FriendActivityFeed } from '@/entities/friends/model/types';
import FriendFeedListItem from '@/features/friends/friend-feed-list-item';
import { useGetFeedInfinite } from '@/shared/api/@generated/social-api/social-api';
import { useInfiniteScroll } from '@/shared/model/use-infinite-scroll';
import SectionCard from '@/shared/ui/card/section-card';

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
  } = useGetFeedInfinite(
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
            <div className="min-h-[150px] flex items-center justify-center">
              <p className="text-text-3-w text-label1 md:text-heading1 text-center py-15 md:py-39">
                아직 활동한 친구가 없어요. <br />더 많은 사용자들과 친구가 되어 보세요!
              </p>
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
