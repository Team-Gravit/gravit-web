import { tiers } from '../model/tiers';

/** leagueId로 티어 아이콘을 찾는다. 없으면 최하위 티어(브론즈 3) 아이콘을 반환한다. */
export const getTierIconById = (leagueId: number) => {
  return tiers.find((t) => t.id === leagueId)?.icon ?? tiers[0].icon;
};

/** 티어 이름으로 아이콘을 찾는다. 없으면 최하위 티어(브론즈 3) 아이콘을 반환한다. */
export const getTierIconByName = (leagueName: string) => {
  return tiers.find((t) => t.name === leagueName)?.icon ?? tiers[0].icon;
};
