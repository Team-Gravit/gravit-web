import { useGetMyLeagueWithProfile } from '@/shared/api/generated/userleague-api/userleague-api';

/** 내 리그 프로필(내 티어·순위·프로필). */
export function useMyLeagueProfile() {
  return useGetMyLeagueWithProfile({ query: { staleTime: 1000 * 60, retry: 1 } });
}
