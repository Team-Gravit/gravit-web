import type { CalendarHeatmapValue } from './calendar-heatmap.model';

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function createMockYearHeatmapData(): CalendarHeatmapValue[] {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const result: CalendarHeatmapValue[] = [];

  const current = new Date(startOfYear);
  while (current <= today) {
    result.push({
      date: formatDate(current),
      count: Math.floor(Math.random() * 13),
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
}