import { createFileRoute } from '@tanstack/react-router';

import { useGetMyLeagueHistory } from '@/shared/api/@generated/league-history-api/league-history-api';
import SectionCard from '@/shared/ui/card/section-card';
import LeagueHistoryChart from '@/widgets/user/league/ui/league-history-chart';
import LeagueStatSection from '@/widgets/user/league/ui/league-stat-section';

export const Route = createFileRoute('/_authenticated/my/_profile-layout/league')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending } = useGetMyLeagueHistory();

  if (isPending) return null;
  if (!data) return null;
  console.log(data);

  return (
    <SectionCard title="리그 시즌 히스토리" description="시즌별 최종 티어 기록">
      <div className="my-4 md:mb-0">
        <LeagueStatSection
          stats={{
            bestLeagueName: data.bestLeagueName,
            currentSeasonRank: data.currentSeasonRank,
            top3SeasonCount: data.top3SeasonCount,
          }}
        />
      </div>
      <LeagueHistoryChart
        leagueHistory={{
          seasonHistory: data.seasonHistory,
          totalSeasonCount: data.totalSeasonCount,
        }}
      />
    </SectionCard>
  );
}
