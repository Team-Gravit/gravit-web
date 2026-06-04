import type { FollowType } from '@/entities/follow/model/types';
import { useFollowList } from '@/entities/follow/model/use-follow-list';
import { useInfiniteScroll } from '@/shared/model/use-infinite-scroll';

import FollowListItem from './follow-list-item';

interface FollowListContainerProps {
  type: FollowType;
  enabled?: boolean;
}

function FollowListContainer({ type, enabled = true }: FollowListContainerProps) {
  const currentQuery = useFollowList(type, enabled);

  const currentTabList = currentQuery.data?.pages.flatMap((page) => page.contents) ?? [];

  const loadMoreRef = useInfiniteScroll({
    enabled,
    hasNextPage: currentQuery.hasNextPage,
    isFetchingNextPage: currentQuery.isFetchingNextPage,
    fetchNextPage: currentQuery.fetchNextPage,
  });

  return (
    <>
      {/* TODO : Fallback UI 요청 */}
      {currentTabList.length > 0 && (
        <ul className="flex flex-col">
          {currentTabList.map((user) => (
            <FollowListItem key={`${type}-${user.id}`} type={type} user={user} />
          ))}

          {currentQuery.hasNextPage && (
            <li ref={loadMoreRef} className="h-4 shrink-0" aria-hidden />
          )}
        </ul>
      )}
    </>
  );
}

export default FollowListContainer;
