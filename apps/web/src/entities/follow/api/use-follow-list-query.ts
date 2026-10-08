import {
  getGetFollowersInfiniteQueryKey,
  getGetFollowingsInfiniteQueryKey,
  useGetFollowersInfinite,
  useGetFollowingsInfinite,
} from '@/shared/api/generated/friend-api/friend-api';
import { infiniteSelector } from '@/shared/lib/infinite-selector';

import type { FollowType, FollowUser } from '../model/types';

const INITIAL_PAGE_PARAM = 0;

interface UseFollowListQueryParams {
  type: FollowType;
  enabled?: boolean;
}

/**
 * 팔로워/팔로잉 목록을 page 기반 무한스크롤로 조회한다.
 * 팔로잉 목록은 관계상 모두 내가 팔로우 중이므로 isFollowing을 true로 채운다.
 */
export function useFollowListQuery({ type, enabled = true }: UseFollowListQueryParams) {
  const followersQuery = useGetFollowersInfinite(
    { page: INITIAL_PAGE_PARAM },
    {
      query: {
        queryKey: getGetFollowersInfiniteQueryKey(),
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
        enabled: enabled && type === 'followers',
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
      },
    },
  );

  const followingsQuery = useGetFollowingsInfinite(
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

  const currentQuery = type === 'followers' ? followersQuery : followingsQuery;

  const followUsers: FollowUser[] =
    type === 'followers'
      ? infiniteSelector(followersQuery.data)
      : infiniteSelector(followingsQuery.data).map((user) => ({ ...user, isFollowing: true }));

  return { currentQuery, followUsers };
}
