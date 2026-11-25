import type { ReactNode } from 'react';

import { useMyPageWeeklyReport } from '@/entities/learning';
import { cn } from '@/shared/lib/cn';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';

import { WeeklyBarChart } from './weekly-bar-chart';

const CARD_CLASS =
  'gap-4 rounded-8 border border-[#fbf1ff]/60 px-4 py-5 shadow-elevation-1 md:gap-6 md:rounded-12 md:px-8 md:py-7';

// 실제 막대 차트처럼 요일별 높이를 다르게 둔 로딩용 더미 높이(px). 위아래 라벨이 없어 막대로 영역을 채운다.
const SKELETON_BAR_HEIGHTS_PX = [100, 160, 120, 180, 140, 90, 170];

/**
 * 이번주 리포트 카드. 요일별 완료 막대·이번 주 완료 레슨 수·주차별 증감을 보여준다.
 * 데스크톱은 "이번주 리포트" 라벨과 완료 수(큰 타이포)를 막대 위에, 모바일은
 * "일별 완료한 레슨 수" 라벨을 막대 위에·완료 수(작은 타이포)를 막대 아래에 둔다(시안).
 * 내용이 대부분 데이터에 딸리므로 카드 셸만 유지하고 본문 전체를 상태별로 바꾼다.
 */
export function WeeklyReport() {
  const { data, isPending, isError, refetch } = useMyPageWeeklyReport();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  let body: ReactNode;
  if (isError) {
    body = (
      <CardRetryStatus
        className="py-8"
        sectionName="이번주 리포트"
        onRetry={() => refetch({ throwOnError: true })}
      />
    );
  } else if (isPending) {
    // 지연되면 스켈레톤을 보이고, 그 전(delay 구간)엔 같은 높이를 invisible 로 잡아 깜빡임·시프트를 막는다.
    body = <WeeklyReportBodySkeleton isHidden={!showSkeleton} />;
  } else if (!data) {
    body = null;
  } else {
    const dailyCounts = [
      data.MONDAY,
      data.TUESDAY,
      data.WEDNESDAY,
      data.THURSDAY,
      data.FRIDAY,
      data.SATURDAY,
      data.SUNDAY,
    ];

    body = (
      <>
        {/* 데스크톱: "이번주 리포트" 라벨 + 완료 수 */}
        <div className="hidden flex-col gap-2 md:flex">
          <p className="text-body1-normal text-text-4">이번주 리포트</p>
          <CompletedLessonStat count={data.thisWeekCompletedLessonCount} />
        </div>

        {/* 모바일: 막대 위 라벨 */}
        <p className="text-label2 text-text-4 md:hidden">일별 완료한 레슨 수</p>

        <WeeklyBarChart dailyCounts={dailyCounts} />

        {/* 모바일: 막대 아래 완료 수 */}
        <CompletedLessonStat count={data.thisWeekCompletedLessonCount} className="md:hidden" />

        <ul className="flex flex-col gap-3">
          {data.weekOverWeekDeltas.map((delta, index) => (
            <WeekComparisonItem key={index} weeksAgo={index + 1} delta={delta} />
          ))}
        </ul>
      </>
    );
  }

  return (
    <Card className={CARD_CLASS} aria-busy={isPending || undefined}>
      {body}
    </Card>
  );
}

interface CompletedLessonStatProps {
  count: number;
  className?: string;
}

/** 모바일 label1/heading1(우측), 데스크톱 title3/title1(중앙)로 완료 수를 강조한다. */
function CompletedLessonStat({ count, className }: CompletedLessonStatProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-label1 text-text-1 md:text-title3">이번 주 완료 레슨</p>
      <p className="w-full text-left text-heading1 text-text-1  md:text-title1">{count}개</p>
    </div>
  );
}

interface WeekComparisonItemProps {
  weeksAgo: number;
  delta: number;
}

/** 지난 주차 대비 증감. 증가(0 이상)는 main, 감소는 파랑(semantic-5)으로 표시한다. */
function WeekComparisonItem({ weeksAgo, delta }: WeekComparisonItemProps) {
  const isIncrease = delta >= 0;

  return (
    <li className="flex items-center justify-between rounded-4 border border-bg-3 p-3 md:rounded-8 md:border-divider-2 md:p-4">
      <span className="text-caption1 text-text-3 md:text-body1-normal">{weeksAgo}주 전 대비</span>
      <span
        className={cn(
          'text-label2 font-medium md:text-body1-normal',
          isIncrease ? 'text-main' : 'text-semantic-5',
        )}
      >
        {isIncrease ? `+${delta}` : delta}개
      </span>
    </li>
  );
}

function WeeklyReportBodySkeleton({ isHidden = false }: { isHidden?: boolean }) {
  return (
    // Card 의 gap(gap-4 md:gap-6)을 그대로 재현해 데이터 본문과 높이를 맞춘다.
    <SkeletonReserve isHidden={isHidden} className="flex flex-col gap-4 md:gap-6">
      <Skeleton variant="text" className="w-24 text-body1-normal" />
      <WeeklyChartSkeleton />
      <div className="flex flex-col gap-3">
        <Skeleton
          variant="block"
          className="h-[41.5px] md:h-[56.5px] w-full rounded-4 md:rounded-8"
        />
        <Skeleton
          variant="block"
          className="h-[41.5px] md:h-[56.5px] w-full rounded-4 md:rounded-8"
        />
        <Skeleton
          variant="block"
          className="h-[41.5px] md:h-[56.5px] w-full rounded-4 md:rounded-8"
        />
      </div>
    </SkeletonReserve>
  );
}

/** WeeklyBarChart 의 차트 영역을 요일별 다른 높이의 막대만으로 미러링한다(개수·요일 라벨은 생략). */
function WeeklyChartSkeleton() {
  return (
    <div className="flex h-[243px] md:min-h-68 items-end gap-2 md:gap-4">
      {SKELETON_BAR_HEIGHTS_PX.map((height, index) => (
        <Skeleton key={index} variant="block" height={height} className="flex-1 rounded-8" />
      ))}
    </div>
  );
}
