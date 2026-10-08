import { useNavigate } from '@tanstack/react-router';

import { LeagueHistoryChart, formatLeagueTier, useMyLeagueHistory } from '@/entities/league';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Button } from '@/shared/ui/button';
import { Card, CardStatus } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { StatItem } from '@/shared/ui/stat-item';

const CARD_CLASS =
  'gap-6 rounded-8 bg-white px-4 py-5 shadow-elevation-1 md:rounded-12 md:bg-bg-1 md:px-8 md:py-7';

/**
 * 마이페이지 리그 탭. 시즌 통계 3개와 시즌별 티어 추이 차트를 보여준다.
 * 시즌 기록이 없으면 카드 본문을 빈 상태(학습하러 가기)로 바꾼다.
 */
export function LeagueTab() {
  const navigate = useNavigate();
  const { data, isPending } = useMyLeagueHistory();
  const showSkeleton = useDelayedFlag(isPending);

  if (!data) {
    return showSkeleton ? <LeagueTabSkeleton /> : null;
  }

  return (
    <Card className={CARD_CLASS}>
      <div className="flex flex-col gap-2">
        <p className="text-label2 text-text-4 md:text-body1-normal">리그 시즌 히스토리</p>
        <p className="text-headline2 text-text-1 md:text-title3">시즌별 최종 티어 기록</p>
      </div>

      {data.seasonHistory.length > 0 ? (
        <div className="flex flex-col gap-11">
          <div className="flex items-center">
            <StatItem
              valueTone="accent"
              value={`${data.currentSeasonRank}위`}
              label="현재 시즌 순위"
            />
            <StatItem
              className="border-l border-divider-1"
              value={`${data.top3SeasonCount}회`}
              label="3위권 진입"
            />
            <StatItem
              className="border-l border-divider-1"
              value={formatLeagueTier(data.bestLeagueName)}
              label="최고티어"
            />
          </div>
          <LeagueHistoryChart seasonHistory={data.seasonHistory} />
        </div>
      ) : (
        <CardStatus
          className="whitespace-pre-line py-8 md:py-50"
          message={'아직 획득한 LP가 없어요.\n어서 학습을 진행해 주세요!'}
          action={
            <Button
              size="lg"
              className="text-headline2"
              onClick={() => navigate({ to: '/learning' })}
            >
              학습하러 가기
            </Button>
          }
        />
      )}
    </Card>
  );
}

function LeagueTabSkeleton() {
  return (
    <Card className={CARD_CLASS}>
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="w-24 text-body1-normal" />
        <Skeleton variant="text" className="w-40 text-title3" />
      </div>
      <div className="flex flex-col gap-11">
        <div className="flex items-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <Skeleton variant="text" className="w-16 text-title1" />
              <Skeleton variant="text" className="w-20 text-body1-normal" />
            </div>
          ))}
        </div>
        <Skeleton variant="block" className="h-[200px] w-full rounded-8 md:h-[300px]" />
      </div>
    </Card>
  );
}
