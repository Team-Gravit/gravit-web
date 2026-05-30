import { cn } from "@/shared/lib/cn";
import { HEATMAP_COLOR_LEVELS } from "./calendar-heatmap.constants";

type CalendarHeatmapCellProps = {
	level: 0 | 1 | 2 | 3 | 4;
	date: string | null;
	count: number;
};

export default function CalendarHeatmapCell({
	level,
	date,
	count,
}: CalendarHeatmapCellProps) {
	if (!date) {
		return <div className="size-3 rounded-xs md:rounded-sm md:size-4" />;
	}

	return (
		<div
			className={cn(
				"size-3 rounded-xs md:rounded-sm md:size-4",
				HEATMAP_COLOR_LEVELS[level],
			)}
			data-date={date}
			data-label={`${count}회 학습`}
		/>
	);
}