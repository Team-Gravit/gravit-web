import { useMemo } from "react";
import type {
	CalendarHeatmapRange,
	CalendarHeatmapValue,
} from "./calendar-heatmap.model";
import { createHeatmapWeeks } from "./calendar-heatmap.utils";
import CalendarHeatmapGrid from "./calendar-heatmap-grid-cell";
import CalendarHeatmapMonthLabels from "./calendar-heatmap-month-labels";
import CalendarHeatmapWeekLabels from "./calendar-heatmap-week-labels";

type CalendarHeatmapProps = {
	values: CalendarHeatmapValue[];
	range?: CalendarHeatmapRange;
};

export default function CalendarHeatmap({ values }: CalendarHeatmapProps) {
	const weeks = useMemo(() => {
		const year = new Date().getFullYear();
		const startOfYear = new Date(year, 0, 1);
		return createHeatmapWeeks({ values, startDate: startOfYear, weeks: 53 });
	}, [values]);

	return (
			<div
				className="
				w-max
				[--heatmap-cell-size:12px]
				[--heatmap-cell-gap:4px]
				md:[--heatmap-cell-size:16px]
				md:[--heatmap-cell-gap:4px]
				flex flex-col gap-2 md:gap-4
			"
			>
				<div className="flex flex-col gap-4">
					<CalendarHeatmapMonthLabels weeks={weeks} />

					<div className="flex gap-2 md:gap-4">
						<CalendarHeatmapWeekLabels />
						<CalendarHeatmapGrid weeks={weeks} />
					</div>
				</div>
			</div>
	);
}
