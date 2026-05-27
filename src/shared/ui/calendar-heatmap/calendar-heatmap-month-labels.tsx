import type {
	CalendarHeatmapDay,
	CalendarHeatmapWeek,
} from "./calendar-heatmap.model";

const MONTH_NAMES = [
	"1월",
	"2월",
	"3월",
	"4월",
	"5월",
	"6월",
	"7월",
	"8월",
	"9월",
	"10월",
	"11월",
	"12월",
];

type MonthLabel = {
	month: number;
	colIndex: number;
};

function getMonthLabels(weeks: CalendarHeatmapWeek[]): MonthLabel[] {
	const labels: MonthLabel[] = [];

	weeks.forEach((week, colIndex) => {
		// 해당 주에 특정 달의 시작일이 있는지 확인
		const firstOfMonth = week.find(
			(day): day is CalendarHeatmapDay & { date: string } =>
				day.date !== null && new Date(day.date).getDate() === 1,
		);

		// 있다면 라벨 추가
		if (firstOfMonth) {
			labels.push({ month: new Date(firstOfMonth.date).getMonth(), colIndex });
		}
	});

	return labels;
}

type CalendarHeatmapMonthLabelsProps = {
	weeks: CalendarHeatmapWeek[];
};

export default function CalendarHeatmapMonthLabels({
	weeks,
}: CalendarHeatmapMonthLabelsProps) {
	const labels = getMonthLabels(weeks);

	return (
		<div className="relative h-[var(--heatmap-cell-size)] ml-[53px]">
			{labels.map(({ month, colIndex }) => (
				<span
					key={month}
					className="absolute text-caption1 text-text-4 whitespace-nowrap"
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
