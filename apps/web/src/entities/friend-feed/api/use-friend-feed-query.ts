import {
  getGetFeedInfiniteQueryKey,
  useGetFeedInfinite,
} from '@/shared/api/generated/social-api/social-api';
import { infiniteSelector } from '@/shared/lib/infinite-selector';

import type { FriendFeed } from '../model/types';

const INITIAL_PAGE_PARAM = 0;

/** 친구 활동 피드를 page 기반 무한스크롤로 조회한다. */
export function useFriendFeedQuery() {
  const query = useGetFeedInfinite(
    { page: INITIAL_PAGE_PARAM },
    {
      query: {
        queryKey: getGetFeedInfiniteQueryKey(),
        getNextPageParam: (lastPage, allPages) =>
          lastPage.hasNextPage ? allPages.length : undefined,
      },
    },
  );

  const feeds: FriendFeed[] = infiniteSelector(query.data);

  return { query, feeds };
}
