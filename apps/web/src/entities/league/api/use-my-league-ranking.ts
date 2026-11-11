import { useInfiniteQuery } from '@tanstack/react-query';

import { getLeagueRankingByUser } from '@/shared/api/generated/userleague-api/userleague-api';

import { getAnchorPage } from '../model/anchor';
import { normalizeRankingPage } from './normalize-ranking-page';
import { LEAGUE_RANKING_QUERY_KEY } from './use-league-ranking';

/**
 * 내 티어의 랭킹(양방향 무한 스크롤). 무한 쿼리 조립·정규화 이유는 {@link useLeagueRanking} 참고.
 *
 * 내 등수가 속한 앵커 페이지에서 시작해 위(상위 등수)·아래(하위 등수)로 모두 더 불러온다.
 * 페이지 번호는 `allPages.length`가 아니라 각 끝 페이지의 pageParam을 기준으로 계산한다 —
 * 앵커가 0이 아니면 길이 기반 계산이 어긋나기 때문이다.
 */
export function useMyLeagueRanking(rank: number, enabled = true) {
  const anchorPage = getAnchorPage(rank);

  return useInfiniteQuery({
    // 앵커가 바뀌면(내 등수 변동) 다른 시작점의 목록이므로 키를 분리한다.
    queryKey: [...LEAGUE_RANKING_QUERY_KEY, 'me', anchorPage],
    queryFn: async ({ pageParam }) => normalizeRankingPage(await getLeagueRankingByUser(pageParam)),
    initialPageParam: anchorPage,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasNextPage ? lastPageParam + 1 : undefined,
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) =>
      firstPageParam > 0 ? firstPageParam - 1 : undefined,
    enabled,
    staleTime: 1000 * 60,
  });
}
