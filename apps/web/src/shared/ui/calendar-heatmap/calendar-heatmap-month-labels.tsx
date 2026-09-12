import type { CalendarHeatmapDay, CalendarHeatmapWeek } from './calendar-heatmap.model';

const MONTH_NAMES = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

interface MonthLabel {
  month: number;
  colIndex: number;
}

function getMonthLabels(weeks: CalendarHeatmapWeek[]): MonthLabel[] {
  const labels: MonthLabel[] = [];

  weeks.forEach((week, colIndex) => {
    // 해당 주에 특정 달의 시작일(1일)이 있으면 그 열에 월 라벨을 붙인다.
    const firstOfMonth = week.find(
      (day): day is CalendarHeatmapDay & { date: string } =>
        day.date !== null && new Date(day.date).getDate() === 1,
    );

    if (firstOfMonth) {
      labels.push({ month: new Date(firstOfMonth.date).getMonth(), colIndex });
    }
  });

  return labels;
}

interface CalendarHeatmapMonthLabelsProps {
  weeks: CalendarHeatmapWeek[];
}

/** 히트맵 상단 월 라벨. 각 달 1일이 속한 열 위치에 절대 배치한다. */
export function CalendarHeatmapMonthLabels({ weeks }: CalendarHeatmapMonthLabelsProps) {
  const labels = getMonthLabels(weeks);

  return (
    <div className="relative ml-[53px] h-[var(--heatmap-cell-size)]">
      {labels.map(({ month, colIndex }) => (
        <span
          key={month}
          className="absolute whitespace-nowrap text-caption1 text-text-4 md:text-body1-normal"
          style={{
            left: `calc(${colIndex} * (var(--heatmap-cell-size) + var(--heatmap-cell-gap)))`,
          }}
        >
          {MONTH_NAMES[month]}
        </span>
      ))}
    </div>
  );
}
