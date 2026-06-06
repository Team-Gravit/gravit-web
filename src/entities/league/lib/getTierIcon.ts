import { tiers } from '@/shared/lib/tiers';

export const getTierIconById = (leagueId: number) => {
  return tiers.find((t) => t.id === leagueId)?.icon ?? tiers[0].icon; // 기본 아이콘으로 브론즈 3 사용
};

export const getTierIconByName = (leagueName: string) => {
  return tiers.find((t) => t.name === leagueName)?.icon ?? tiers[0].icon; // 기본 아이콘으로 브론즈 3 사용
};
