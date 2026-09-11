import { useInfiniteQuery } from '@tanstack/react-query';

import { getLeagueRanking } from '@/shared/api/generated/userleague-api/userleague-api';

import { normalizeRankingPage } from './normalize-ranking-page';

/**
 * 선택한 티어의 랭킹(무한 스크롤).
 *
 * orval은 페이지별 쿼리만 생성하고 무한 쿼리 훅은 만들지 않으므로 여기서 직접 조립한다.
 * queryKey는 이 목록 전용이며, 이 키로 조회하는 곳이 여기뿐이라 생성 키와 갈라져 무효화가
 * 깨질 대상이 없다.
 */
export function useLeagueRanking(leagueId: number, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['league', 'ranking', 'tier', leagueId],
    queryFn: async ({ pageParam }) =>
      normalizeRankingPage(await getLeagueRanking(leagueId, pageParam)),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNextPage ? allPages.length : undefined),
    enabled: enabled && Boolean(leagueId),
    staleTime: 1000 * 60,
  });
}
