import type { CalendarHeatmapValue } from '@/shared/ui/calendar-heatmap';

interface DailySolvedCount {
  date: string;
  solvedLessonCount: number;
}

/**
 * 서버의 일별 학습량을 연초부터 오늘까지 빠짐없는 히트맵 값 배열로 변환한다.
 * 서버에 없는 날짜는 count 0으로 채워 그리드에 빈 칸이 생기지 않게 한다.
 */
export function transformLearningHistoryToHeatmap(
  serverData: DailySolvedCount[],
): CalendarHeatmapValue[] {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const countByDate = new Map(
    serverData.map(({ date, solvedLessonCount }) => [date, solvedLessonCount]),
  );

  const result: CalendarHeatmapValue[] = [];
  const current = new Date(startOfYear);

  while (current <= today) {
    const date = formatDate(current);
    result.push({ date, count: countByDate.get(date) ?? 0 });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
