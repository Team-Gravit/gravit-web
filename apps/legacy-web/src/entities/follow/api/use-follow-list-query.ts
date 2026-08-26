import {
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useGetFollowersInfinite,
  useGetFollowingsInfinite,
} from '@/shared/api/@generated/friend-api/friend-api';
import { infiniteSelector } from '@/shared/lib/query/selector';

import type { FollowType } from '../model/types';

interface useFollowListQueryProps {
  type: FollowType;
  enabled?: boolean;
}

const INITIAL_PAGE_PARAM = 0;

function useFollowListQuery({ type, enabled = true }: useFollowListQueryProps) {
  const followersQuery = useGetFollowersInfinite(
    { page: INITIAL_PAGE_PARAM },
    {
      query: {
        queryKey: getGetFollowersInfiniteQueryKey(),
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'followers',
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
      },
    },
  );

  const followingQuery = useGetFollowingsInfinite(
    { page: INITIAL_PAGE_PARAM },
    {
      query: {
        queryKey: getGetFollowingsInfiniteQueryKey(),
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'following',
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  );

  const currentQuery = type === 'followers' ? followersQuery : followingQuery;

  const followUsers =
    type === 'followers'
      ? infiniteSelector(followersQuery.data)
      : infiniteSelector(followingQuery.data).map((user) => ({ ...user, isFollowing: true }));

  return {
    currentQuery,
    followUsers,
  };
}

export default useFollowListQuery;
