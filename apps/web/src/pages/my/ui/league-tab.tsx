import type { ReactNode } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { LeagueHistoryChart, formatLeagueTier, useMyLeagueHistory } from '@/entities/league';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Card, CardRetryStatus, CardStatus, CardStatusButton } from '@/shared/ui/card';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';
import { StatItem } from '@/shared/ui/stat-item';

const CARD_CLASS =
  'gap-6 rounded-8 bg-white px-4 py-5 shadow-elevation-1 md:rounded-12 md:bg-bg-1 md:px-8 md:py-7';

/**
 * 마이페이지 리그 탭. 시즌 통계 3개와 시즌별 티어 추이 차트를 보여준다.
 * 카드 셸·헤더는 항상 렌더하고 본문만 로딩·에러·빈 상태(학습하러 가기)·데이터로 바꾼다.
 */
export function LeagueTab() {
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useMyLeagueHistory();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  let body: ReactNode;
  if (isError) {
    body = (
      <CardRetryStatus
        className="py-8 md:py-50"
        sectionName="리그 기록"
        onRetry={() => refetch({ throwOnError: true })}
      />
    );
  } else if (isPending) {
    // 지연되면 스켈레톤을 보이고, 그 전(delay 구간)엔 같은 높이를 invisible 로 잡아 깜빡임·시프트를 막는다.
    body = <LeagueBodySkeleton isHidden={!showSkeleton} />;
  } else if (!data || data.seasonHistory.length === 0) {
    body = (
      <CardStatus
        className="whitespace-pre-line py-8 md:py-50"
        message={'아직 획득한 LP가 없어요.\n어서 학습을 진행해 주세요!'}
        action={
          <CardStatusButton type="button" onClick={() => navigate({ to: '/learning' })}>
            학습하러 가기
          </CardStatusButton>
        }
      />
    );
  } else {
    body = (
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
    );
  }

  return (
    <Card className={CARD_CLASS} aria-busy={isPending || undefined}>
      <div className="flex flex-col gap-2">
        <p className="text-label2 text-text-4 md:text-body1-normal">리그 시즌 히스토리</p>
        <p className="text-headline2 text-text-1 md:text-title3">시즌별 최종 티어 기록</p>
      </div>
      {body}
    </Card>
  );
}

function LeagueBodySkeleton({ isHidden = false }: { isHidden?: boolean }) {
  return (
    <SkeletonReserve isHidden={isHidden} className="flex flex-col gap-10 md:gap-11">
      <div className="flex items-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <Skeleton variant="text" className="w-16 text-headline2 md:text-title1" />
            <Skeleton variant="text" className="w-20 text-caption1 md:text-body1-normal" />
          </div>
        ))}
      </div>
      <Skeleton variant="block" className="h-[200px] w-full rounded-8 md:h-[300px]" />
    </SkeletonReserve>
  );
}
