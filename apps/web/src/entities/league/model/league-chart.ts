import type { SeasonHistoryEntry } from '@/shared/api/generated/model/seasonHistoryEntry';
import type { LineChartPoint, LineChartYTick } from '@/shared/ui/line-chart';

import { formatShortLeagueTier } from '../lib/format-league-tier';

export interface LeagueChartPoint extends LineChartPoint {
  displayKey: string;
  leagueName: string;
  isCurrent: boolean;
}

/**
 * 시즌 히스토리를 LineChart 입력으로 변환한다.
 * Y축은 등장한 티어를 sortOrder 순으로 카테고리화하고(값 1..n), X축은 시즌 순서다.
 */
export function toLeagueChartData(seasonHistory: SeasonHistoryEntry[]): {
  points: LeagueChartPoint[];
  yTicks: LineChartYTick[];
} {
  // 등장한 티어를 sortOrder 오름차순으로 중복 없이 모은다.
  const tiersBySortOrder = Array.from(
    new Map(seasonHistory.map((entry) => [entry.sortOrder, entry.leagueName])).entries(),
  ).sort(([a], [b]) => a - b);

  // sortOrder → Y 카테고리 값(1부터). 낮은 티어가 아래(작은 값)에 오도록 한다.
  const sortOrderToValue = new Map(
    tiersBySortOrder.map(([sortOrder], index) => [sortOrder, index + 1]),
  );

  const yTicks: LineChartYTick[] = tiersBySortOrder.map(([, leagueName], index) => ({
    value: index + 1,
    label: formatShortLeagueTier(leagueName),
  }));

  const points: LeagueChartPoint[] = seasonHistory.map((entry, index) => ({
    key: entry.seasonKey,
    x: index,
    y: sortOrderToValue.get(entry.sortOrder) ?? 1,
    highlight: entry.isCurrent,
    displayKey: entry.displayKey,
    leagueName: entry.leagueName,
    isCurrent: entry.isCurrent,
  }));

  return { points, yTicks };
}
