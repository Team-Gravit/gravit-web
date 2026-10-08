import { useMemo } from 'react';

import { CalendarHeatmapGrid } from './calendar-heatmap-grid';
import { CalendarHeatmapMonthLabels } from './calendar-heatmap-month-labels';
import { CalendarHeatmapWeekLabels } from './calendar-heatmap-week-labels';
import type { CalendarHeatmapValue } from './calendar-heatmap.model';
import { createHeatmapWeeks } from './calendar-heatmap.utils';

export interface CalendarHeatmapProps {
  values: CalendarHeatmapValue[];
}

/**
 * GitHub 잔디식 연간 학습 히트맵. 셀 크기·간격은 CSS 변수로 반응형 제어한다(모바일 12px / 데스크톱 16px).
 * 넓어서 가로로 넘칠 수 있으므로 사용하는 쪽에서 `ScrollArea`로 감싼다.
 */
export function CalendarHeatmap({ values }: CalendarHeatmapProps) {
  const weeks = useMemo(() => {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    return createHeatmapWeeks({ values, startDate: startOfYear, weeks: 53 });
  }, [values]);

  return (
    <div className="flex w-max flex-col gap-2 [--heatmap-cell-gap:4px] [--heatmap-cell-size:12px] md:gap-4 md:[--heatmap-cell-gap:5px] md:[--heatmap-cell-size:16px]">
      <div className="flex flex-col gap-4">
        <CalendarHeatmapMonthLabels weeks={weeks} />

        <div className="flex gap-2 md:gap-4">
          <CalendarHeatmapWeekLabels />
          <CalendarHeatmapGrid weeks={weeks} />
        </div>
      </div>
    </div>
  );
}
