import { useEnterHome } from '@/shared/api/generated/league-api/league-api';

/** 리그 홈 진입 데이터(현재 시즌·지난 시즌 팝업 여부). */
export function useLeagueHome() {
  return useEnterHome({ query: { staleTime: 1000 * 60 } });
}
