import useFollowListQuery from '@/entities/follow/api/use-follow-list-query';
import type { FollowType } from '@/entities/follow/model/types';
import { useInfiniteScroll } from '@/shared/model/use-infinite-scroll';

import FollowListItem from './follow-list-item';
import FollowListSkeleton from './follow-list-skeleton';

interface FollowListContainerProps {
  type: FollowType;
  enabled?: boolean;
}

function FollowListContainer({ type, enabled = true }: FollowListContainerProps) {
  const { currentQuery, followUsers } = useFollowListQuery({ type });

  const loadMoreRef = useInfiniteScroll({
    enabled,
    hasNextPage: currentQuery.hasNextPage,
    isFetchingNextPage: currentQuery.isFetchingNextPage,
    fetchNextPage: currentQuery.fetchNextPage,
  });

  if (currentQuery.isPending || currentQuery.isRefetching) return <FollowListSkeleton />;

  return (
    <>
      {/* TODO : Fallback UI 요청 */}
      {followUsers.length > 0 && (
        <ul className="flex flex-col">
          {followUsers.map((user) => (
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
