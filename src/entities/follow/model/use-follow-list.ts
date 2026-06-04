import {
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useGetFollowersInfinite,
  useGetFollowingsInfinite,
} from '@/shared/api/@generated/friend-api/friend-api';

import { mapFollowerList, mapFollowingList } from './mapper';
import type { FollowerList, FollowingList, FollowType } from './types';

export function useFollowList(type: FollowType, enabled = true) {
  const followersQuery = useGetFollowersInfinite(
    { page: 0 },
    {
      query: {
        queryKey: getGetFollowersInfiniteQueryKey(),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'followers',
        refetchOnMount: true,
        staleTime: 0,
        gcTime: 0,
        select: (data): { pages: FollowerList[]; pageParams: unknown[] } => ({
          ...data,
          pages: data.pages.map((response) => mapFollowerList(response)),
        }),
      },
    },
  );

  const followingQuery = useGetFollowingsInfinite(
    { page: 0 },
    {
      query: {
        queryKey: getGetFollowingsInfiniteQueryKey(),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'following',
        refetchOnMount: true,
        staleTime: 5 * 60 * 1000,
        gcTime: 0,
        select: (data): { pages: FollowingList[]; pageParams: unknown[] } => ({
          ...data,
          pages: data.pages.map((response) => mapFollowingList(response)),
        }),
      },
    },
  );

  return type === 'followers' ? followersQuery : followingQuery;
}
