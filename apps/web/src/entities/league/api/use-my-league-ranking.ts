import { useInfiniteQuery } from '@tanstack/react-query';

import { getLeagueRankingByUser } from '@/shared/api/generated/userleague-api/userleague-api';

import { normalizeRankingPage } from './normalize-ranking-page';

/**
 * 내 티어의 랭킹(무한 스크롤). 무한 쿼리 조립·정규화 이유는 {@link useLeagueRanking} 참고.
 */
export function useMyLeagueRanking(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['league', 'ranking', 'me'],
    queryFn: async ({ pageParam }) => normalizeRankingPage(await getLeagueRankingByUser(pageParam)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNextPage ? allPages.length : undefined),
    enabled,
    staleTime: 1000 * 60,
  });
}
