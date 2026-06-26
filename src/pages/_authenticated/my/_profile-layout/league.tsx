import { createFileRoute, Link } from '@tanstack/react-router';

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
      {data && (
        <>
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
        </>
      )}

      {!data && (
        <div className="min-h-[230px] md:min-h-[540px] flex flex-col items-center justify-center">
          <p className="text-center text-label1 md:text-heading1 text-text-3-w mb-4 md:mb-8">
            아직 획득한 LP가 없어요. <br /> 어서 학습을 진행해 주세요!
          </p>

          <Link
            to={'/learning'}
            className="bg-main-2 rounded-lg text-cta-text  text-label1 md:text-headline2 px-5 py-3 md:py-4"
          >
            학습하러 가기
          </Link>
        </div>
      )}
    </SectionCard>
  );
}
