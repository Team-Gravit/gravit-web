import { useEffect, useRef } from 'react';

import type { CalendarHeatmapWeek } from './calendar-heatmap.model';
import CalendarHeatmapCell from './calendar-heatmap-cell';
import { hideTooltip, showTooltip } from './calendar-heatmap-tooltip.utils';

type CalendarHeatmapGridProps = {
  weeks: CalendarHeatmapWeek[];
};

export default function CalendarHeatmapGrid({ weeks }: CalendarHeatmapGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const tooltip = tooltipRef.current;

    const handleMouseEnter = (e: MouseEvent) => {
      const cell = (e.target as HTMLElement).closest('[data-date]');
      if (!cell || !tooltip) return;

      showTooltip(tooltip, cell as HTMLElement, {
        date: cell?.getAttribute('data-date') || '',
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
        key={'heatmap-grid'}
        aria-label="학습 기록 히트맵"
        ref={containerRef}
      >
        {weeks.map((week, weekIndex) => (
          <div
            key={`heatmap-grid ${weekIndex}`}
            className="flex flex-col gap-[var(--heatmap-cell-gap)]"
          >
            {week.map((day) => (
              <CalendarHeatmapCell
                key={day.date}
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
        className="fixed z-50 hidden rounded-md bg-gray-900 px-2 py-1 text-caption1 text-white pointer-events-none"
      />
    </>
  );
}
