export { tiers, type Tier } from './model/tiers';
export type { LeagueUser, LeagueTierInfo } from './model/types';
export { mapToLeagueUser, mapToTierInfo } from './model/mappers';
export { TierIcon, type TierIconProps } from './ui/tier-icon';

// 생성 DTO를 도메인 경계에서 다시 노출해 위젯이 생성 경로에 직접 결합하지 않게 한다.
export type { LastSeasonPopupDto } from '@/shared/api/generated/model';

export { useLeagueHome } from './api/use-league-home';
export { useLeagueInfo } from './api/use-league-info';
export { useMyLeagueProfile } from './api/use-my-league-profile';
export { useLeagueRanking } from './api/use-league-ranking';
export { useMyLeagueRanking } from './api/use-my-league-ranking';

export { getLeagueSummaryQueryKey, useLeagueSummary } from './api/use-league-summary';
export { TierBadge, type TierBadgeProps } from './ui/tier-badge';

// 마이페이지 리그 시즌 히스토리. 변환 없이 이름만 도메인 어휘로 노출한다.
export { useGetMyLeagueHistory as useMyLeagueHistory } from '@/shared/api/generated/league-history-api/league-history-api';
export { LeagueHistoryChart } from './ui/league-history-chart';
export { formatLeagueTier, formatShortLeagueTier } from './lib/format-league-tier';
