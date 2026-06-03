import { mapFollowerList, mapFollowingList } from '@/entities/follow/model/mapper';
import type { FollowingList, FollowType } from '@/entities/follow/model/types';
import {
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useGetFollowersInfinite,
  useGetFollowingsInfinite,
} from '@/shared/api/@generated/friend-api/friend-api';
import { useInfiniteScroll } from '@/shared/model/use-infinite-scroll';

import FollowListItem from './follow-list-item';

interface FollowListContainerProps {
  type: FollowType;
  enabled?: boolean;
}

function FollowListContainer({ type, enabled = true }: FollowListContainerProps) {
  const followersQuery = useGetFollowersInfinite(
    { page: 0 },
    {
      query: {
        queryKey: getGetFollowersInfiniteQueryKey({}),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'followers',
        refetchOnMount: true,
        staleTime: 0,
        gcTime: 0,
        select: (data): { pages: FollowingList[]; pageParams: unknown[] } => {
          return {
            ...data,
            pages: data.pages.map((response) => mapFollowerList(response)),
          };
        },
      },
    },
  );

  const followingQuery = useGetFollowingsInfinite(
    { page: 0 },
    {
      query: {
        queryKey: getGetFollowingsInfiniteQueryKey({}),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'following',
        refetchOnMount: true,
        staleTime: 0,
        gcTime: 0,
        select: (data) => {
          return {
            ...data,
            pages: data.pages.map((response) => mapFollowingList(response)),
          };
        },
      },
    },
  );

  const currentQuery = type === 'followers' ? followersQuery : followingQuery;

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
