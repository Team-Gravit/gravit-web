import { cn } from '@/shared/lib/cn';

import { HEATMAP_COLOR_LEVELS } from './calendar-heatmap.constants';
import type { HeatmapLevel } from './calendar-heatmap.model';

interface CalendarHeatmapCellProps {
  level: HeatmapLevel;
  date: string | null;
  count: number;
}

/** 히트맵의 하루 셀. date가 없으면(연초 요일 오프셋) 빈 자리만 차지한다. */
export function CalendarHeatmapCell({ level, date, count }: CalendarHeatmapCellProps) {
  if (!date) {
    return <div className="size-3 rounded-[2px] md:size-4 md:rounded-4" />;
  }

  return (
    <div
      className={cn('size-3 rounded-[2px] md:size-4 md:rounded-4', HEATMAP_COLOR_LEVELS[level])}
      data-date={date}
      data-label={`${count}회 학습`}
    />
  );
}
