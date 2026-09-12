import { useMemo, useState } from 'react';

import { transformLearningHistoryToHeatmap } from '@/entities/learning';
import { useMyPageLearningHistory } from '@/entities/user';
import { Card } from '@/shared/ui/card';
import { CalendarHeatmap, HEATMAP_COLOR_LEVELS } from '@/shared/ui/calendar-heatmap';
import { cn } from '@/shared/lib/cn';
import { ScrollArea } from '@/shared/ui/scroll';
import { Select } from '@/shared/ui/select';

const CURRENT_YEAR = String(new Date().getFullYear());

/**
 * 연도별 학습 기록 히트맵. 연도 선택 시 해당 연도 학습 이력을 다시 조회한다.
 * 선택 가능한 연도 목록은 학습 이력 응답의 `years`에서 얻는다.
 */
export function StudyHeatmap() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const { data } = useMyPageLearningHistory({ year: Number(selectedYear) });

  const dailySolvedCounts = data?.dailySolvedCounts;
  const heatmapValues = useMemo(
    () => (dailySolvedCounts ? transformLearningHistoryToHeatmap(dailySolvedCounts) : undefined),
    [dailySolvedCounts],
  );

  // 연도 목록이 아직 없으면(첫 로딩·데이터 없음) 현재 선택 연도만으로 채운다. 시안상 셀렉트는 항상 보인다.
  const years = data?.years?.length ? data.years : [Number(selectedYear)];
  const yearOptions = years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  return (
    <Card className="w-full min-w-0 gap-2 overflow-hidden rounded-8 p-4 shadow-elevation-1 md:gap-4 md:rounded-12 md:px-8 md:py-7">
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

      <ScrollArea orientation="horizontal">
        {heatmapValues && <CalendarHeatmap values={heatmapValues} />}
      </ScrollArea>

      <HeatmapLegend />

      {data && data.peakLearningHour !== -1 && (
        <div className="rounded-4 border border-bg-3 p-3 text-caption1 text-text-3 md:rounded-8 md:px-6 md:py-4 md:text-body1-normal">
          {`주로 ${data.peakLearningHour}시에 학습하시네요.`}
        </div>
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
