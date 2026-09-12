import { useEffect, useRef } from 'react';

import { CalendarHeatmapCell } from './calendar-heatmap-cell';
import { hideTooltip, showTooltip } from './calendar-heatmap-tooltip.utils';
import type { CalendarHeatmapWeek } from './calendar-heatmap.model';

interface CalendarHeatmapGridProps {
  weeks: CalendarHeatmapWeek[];
}

/** 주 단위 셀 그리드. 마우스오버 시 날짜·학습량 툴팁을 띄운다(이벤트 위임). */
export function CalendarHeatmapGrid({ weeks }: CalendarHeatmapGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const tooltip = tooltipRef.current;

    const handleMouseEnter = (e: MouseEvent) => {
      const cell = (e.target as HTMLElement).closest('[data-date]');
      if (!cell || !tooltip) return;

      showTooltip(tooltip, cell as HTMLElement, {
        date: cell.getAttribute('data-date') || '',
        label: cell.getAttribute('data-label') || '',
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const cell = (e.target as HTMLElement).closest('[data-date]');
      if (!cell || !tooltip) return;
      hideTooltip(tooltip);
    };

    container?.addEventListener('mouseover', handleMouseEnter);
    container?.addEventListener('mouseout', handleMouseLeave);

    return () => {
      container?.removeEventListener('mouseover', handleMouseEnter);
      container?.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        className="flex gap-[var(--heatmap-cell-gap)]"
        aria-label="학습 기록 히트맵"
        ref={containerRef}
      >
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[var(--heatmap-cell-gap)]">
            {week.map((day, dayIndex) => (
              <CalendarHeatmapCell
                key={day.date ?? `empty-${dayIndex}`}
                date={day.date}
                count={day.count}
                level={day.level}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-50 hidden rounded-6 bg-text-1 px-2 py-1 text-caption1 text-text-1-w"
      />
    </>
  );
}
