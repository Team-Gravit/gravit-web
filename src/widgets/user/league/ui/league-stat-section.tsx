import { Fragment } from 'react/jsx-runtime';

import type { LeagueStats } from '@/entities/league/model/types';
import { formatLeagueTier } from '@/shared/lib/format-league-tier';
import StatItem from '@/shared/ui/stat/stat-item';

const getLeagueStats = (data: LeagueStats) => {
  return [
    {
      label: '현재 시즌 순위',
      value: `${data.currentSeasonRank}위`,
      highlight: true,
    },
    {
      label: '3위권 진입',
      value: `${data.top3SeasonCount}회`,
    },
    {
      label: '최고티어',
      value: `${formatLeagueTier(data.bestLeagueName)}`,
    },
  ];
};

interface LeagueStatSectionProps {
  stats: LeagueStats;
}

function LeagueStatSection({ stats }: LeagueStatSectionProps) {
  const leagueStats = getLeagueStats(stats);
  console.log(leagueStats);
  return (
    <div className="flex items-center justify-center md:gap-6  md:mb-11">
      {leagueStats.map((stat, index) => (
        <Fragment key={stat.label}>
          <StatItem
            className="md:bg-transparent"
            key={index}
            value={stat.value}
            label={stat.label}
            highlight={stat.highlight}
          />
          {index < leagueStats.length - 1 && (
            <div aria-hidden className="md:h-32.5 w-px h-12 shrink-0 bg-divider-1" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default LeagueStatSection;
