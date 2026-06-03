const WEEKDAY_LABELS = ['', 'MON', '', 'WED', '', 'FRI', ''];

export default function CalendarHeatmapWeekLabels() {
  return (
    <div className="flex flex-col gap-[var(--heatmap-cell-gap)] w-[37px]">
      {WEEKDAY_LABELS.map((label, index) => (
        <div
          key={index}
          className="
                flex items-center text-caption1 text-text-4
                h-[var(--heatmap-cell-size)]
            "
        >
          {label}
        </div>
      ))}
    </div>
  );
}
