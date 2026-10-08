import { useGetLeague1 } from '@/shared/api/generated/league-api/league-api';

/** 선택한 티어의 LP 범위·이름 정보. leagueId가 없으면 요청하지 않는다. */
export function useLeagueInfo(leagueId: number) {
  return useGetLeague1(leagueId, {
    query: { enabled: Boolean(leagueId), staleTime: 1000 * 60 },
  });
}
