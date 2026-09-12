export interface Tier {
  id: number;
  name: string;
}

/** 브론즈 3(최하위)부터 다이아몬드 1(최상위)까지 15단계. id는 서버 leagueId와 같다. */
export const tiers: Tier[] = [
  { id: 1, name: '브론즈 3' },
  { id: 2, name: '브론즈 2' },
  { id: 3, name: '브론즈 1' },
  { id: 4, name: '실버 3' },
  { id: 5, name: '실버 2' },
  { id: 6, name: '실버 1' },
  { id: 7, name: '골드 3' },
  { id: 8, name: '골드 2' },
  { id: 9, name: '골드 1' },
  { id: 10, name: '플래티넘 3' },
  { id: 11, name: '플래티넘 2' },
  { id: 12, name: '플래티넘 1' },
  { id: 13, name: '다이아몬드 3' },
  { id: 14, name: '다이아몬드 2' },
  { id: 15, name: '다이아몬드 1' },
];
