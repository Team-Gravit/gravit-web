import type {
	CalendarHeatmapDay,
	CalendarHeatmapValue,
	CalendarHeatmapWeek,
} from "./calendar-heatmap.model";

export function getHeatmapLevel(count: number): 0 | 1 | 2 | 3 | 4 {
	if (count <= 0) return 0;
	if (count <= 2) return 1;
	if (count <= 5) return 2;
	if (count <= 9) return 3;
	return 4;
}

function formatDate(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function createHeatmapWeeks({
	values,
	startDate,
	weeks = 53,
}: {
	values: CalendarHeatmapValue[];
	startDate: Date;
	weeks?: number;
}): CalendarHeatmapWeek[] {
	const lastDay = `${new Date().getFullYear()}-12-31`;
	const valueMap = new Map(values.map((item) => [item.date, item.count]));
	const dayOfWeek = startDate.getDay();

	const result: CalendarHeatmapWeek[] = [];

	for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
		const week: CalendarHeatmapDay[] = [];

		for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
			if (weekIndex === 0 && dayIndex < dayOfWeek) {
				week.push({ date: null, count: 0, level: 0 });
				continue;
			}

			const offset = weekIndex * 7 + dayIndex - dayOfWeek;
			const currentDate = new Date(startDate);
			currentDate.setDate(startDate.getDate() + offset);

			const date = formatDate(currentDate);
			const count = valueMap.get(date) ?? 0;

			if (date > lastDay) continue;

			week.push({ date, count, level: getHeatmapLevel(count) });
		}

		result.push(week);
	}

	return result;
}
