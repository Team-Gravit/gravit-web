import { useMemo, useState, type ReactNode } from 'react';

import { transformLearningHistoryToHeatmap, useMyPageLearningHistory } from '@/entities/learning';
import { cn } from '@/shared/lib/cn';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { CalendarHeatmap, HEATMAP_COLOR_LEVELS } from '@/shared/ui/calendar-heatmap';
import { ScrollArea } from '@/shared/ui/scroll';
import { Select } from '@/shared/ui/select';
import { Skeleton, SkeletonReserve } from '@/shared/ui/skeleton';

const CURRENT_YEAR = String(new Date().getFullYear());

/**
 * 연도별 학습 기록 히트맵. 연도 선택 시 해당 연도 학습 이력을 다시 조회한다.
 * 선택 가능한 연도 목록은 학습 이력 응답의 `years`에서 얻는다.
 */
export function StudyHeatmap() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const { data, isPending, isError, refetch } = useMyPageLearningHistory({
    year: Number(selectedYear),
  });
  // 임계값(기본 300ms)보다 오래 걸릴 때만 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);

  const dailySolvedCounts = data?.dailySolvedCounts;
  const heatmapValues = useMemo(
    () => (dailySolvedCounts ? transformLearningHistoryToHeatmap(dailySolvedCounts) : undefined),
    [dailySolvedCounts],
  );

  let heatmapArea: ReactNode;
  if (isPending) {
    // 지연되면 스켈레톤을 보이고, 그 전(delay 구간)엔 같은 높이를 invisible 로 잡아 깜빡임·시프트를 막는다.
    heatmapArea = (
      <SkeletonReserve isHidden={!showSkeleton}>
        <Skeleton variant="block" className="h-[170px] w-full rounded-8" />
      </SkeletonReserve>
    );
  } else if (heatmapValues) {
    heatmapArea = <CalendarHeatmap values={heatmapValues} />;
  }

  // 연도 목록이 아직 없으면(첫 로딩·데이터 없음) 현재 선택 연도만으로 채운다. 시안상 셀렉트는 항상 보인다.
  const years = data?.years?.length ? data.years : [Number(selectedYear)];
  const yearOptions = years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  return (
    <Card
      aria-busy={isPending || undefined}
      className="w-full min-w-0 gap-2 overflow-hidden rounded-8 p-4 shadow-elevation-1 md:gap-4 md:rounded-12 md:px-8 md:py-7"
    >
      <div className="flex items-center justify-between">
        <span className="text-label2 text-text-4 md:text-body1-normal">학습 기록</span>

        <Select
          options={yearOptions}
          value={selectedYear}
          onValueChange={setSelectedYear}
          aria-label="학습 기록 연도 선택"
        />
      </div>

      <div className="h-px w-full bg-divider-1" />

      {isError ? (
        // 헤더(연도 Select)는 남겨 선택만 바꿔도 복구할 수 있게 하고, 본문만 에러로 바꾼다.
        <CardRetryStatus
          className="py-8"
          sectionName="학습 기록"
          onRetry={() => refetch({ throwOnError: true })}
        />
      ) : (
        <>
          <ScrollArea orientation="horizontal">{heatmapArea}</ScrollArea>

          <HeatmapLegend />

          {data && data.peakLearningHour !== -1 && (
            <div className="rounded-4 border border-bg-3 p-3 text-caption1 text-text-3 md:rounded-8 md:px-6 md:py-4 md:text-body1-normal">
              {`주로 ${data.peakLearningHour}시에 학습하시네요.`}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

/** 히트맵 색 단계 범례(적음 → 많음). */
function HeatmapLegend() {
  return (
    <div className="flex w-full items-center justify-end gap-2 text-caption1 text-text-3 md:gap-4 md:text-heading2">
      <span>적음</span>
      <ol className="flex items-center gap-1 md:gap-2">
        {HEATMAP_COLOR_LEVELS.map((color, index) => (
          <li key={index} className={cn('size-3 rounded-4 md:size-4', color)} />
        ))}
      </ol>
      <span>많음</span>
    </div>
  );
}
