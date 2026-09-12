const WEEKDAY_LABELS = ['', 'MON', '', 'WED', '', 'FRI', ''];

/** 히트맵 왼쪽 요일 라벨(월/수/금만 표기). */
export function CalendarHeatmapWeekLabels() {
  return (
    <div className="flex w-[37px] flex-col gap-[var(--heatmap-cell-gap)]">
      {WEEKDAY_LABELS.map((label, index) => (
        <div
          key={index}
          className="flex h-[var(--heatmap-cell-size)] items-center text-caption1 text-text-4 md:text-body1-normal"
        >
          {label}
        </div>
      ))}
    </div>
  );
}
