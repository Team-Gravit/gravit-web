export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;
export type CalendarHeatmapRange = 'half-year' | 'year';

export type CalendarHeatmapProps = {
  values: CalendarHeatmapValue[];
  endDate?: Date;
  maxWeeks?: number; // 기본 53
  minWeeks?: number; // 기본 16
  responsive?: boolean;
};

export type CalendarHeatmapValue = {
  date: string; // '2026-05-22'
  count: number;
};

export type CalendarHeatmapDay = {
  date: string | null; // null이면 빈 셀 (연초 요일 오프셋)
  count: number;
  level: HeatmapLevel;
};

export type CalendarHeatmapWeek = CalendarHeatmapDay[];
