import type { CalendarHeatmapValue } from "@/shared/ui/calendar-heatmap/calendar-heatmap.model";

interface DailySolvedCount {
	date: string;
	solvedLessonCount: number;
}

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
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}