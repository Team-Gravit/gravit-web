import type { SeasonHistoryEntry } from '@/shared/api/generated/model/seasonHistoryEntry';
import { LineChart } from '@/shared/ui/line-chart';

import { formatLeagueTier } from '../lib/format-league-tier';
import { toLeagueChartData } from '../model/league-chart';
import { TierIcon } from './tier-icon';

interface LeagueHistoryChartProps {
  seasonHistory: SeasonHistoryEntry[];
}

/** 시즌별 최종 티어 추이. 범용 LineChart에 티어 Y축·시즌 X축·티어 툴팁을 주입한다. */
export function LeagueHistoryChart({ seasonHistory }: LeagueHistoryChartProps) {
  const { points, yTicks } = toLeagueChartData(seasonHistory);

  return (
    <LineChart
      points={points}
      yTicks={yTicks}
      renderXLabel={(point) => (point.isCurrent ? '현재' : point.displayKey)}
      renderTooltip={(point) => (
        <>
          {/* 모바일 툴팁은 텍스트만(시안), 데스크톱만 티어 아이콘을 함께 보여준다 */}
          <TierIcon tierName={point.leagueName} className="hidden size-11 md:block" />
          <span className="text-label2 font-medium text-text-1 md:text-body1-normal">
            {formatLeagueTier(point.leagueName)}
          </span>
        </>
      )}
      className="h-[200px] md:h-[300px]"
    />
  );
}
