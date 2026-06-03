import Card from "@/shared/ui/card/card";
import WeeklyBarChart from "./weekly-bar-chart";
import WeeklyComparisonList from "./weekly-comparison-list";
import { cn } from "@/shared/lib/cn";
import { transformDailyData } from "@/entities/learning/lib/transform-daily-data";
import type { WeeklyLearningReportResponse } from "@/shared/api/@generated/model";

export default function DailyCompletedLessonsCard({
	data,
}: {
	data: WeeklyLearningReportResponse;
}) {
	const dailyData = transformDailyData(data);
	const maxCount = Math.max(...dailyData.map((d) => d.count), 1);

	return (
		<Card className="md:gap-6">
			<div className="flex flex-col gap-2">
				<Card.Title>이번주 리포트</Card.Title>
				<StatDisplay
					className="md:gap-2 hidden md:flex md:flex-col"
					title="이번 주 완료 레슨"
					value={`${data.thisWeekCompletedLessonCount}개`}
				/>
			</div>
			<WeeklyBarChart lessonData={dailyData} maxCount={maxCount} />
			<div className="flex flex-col gap-4">
				<StatDisplay
					className="flex flex-col gap-2 md:hidden"
					title="이번 주 완료 레슨"
					value={`${data.thisWeekCompletedLessonCount}개`}
				/>
				<WeeklyComparisonList />
			</div>
		</Card>
	);
}

interface StatDisplayProps {
	title: string;
	value: string | number;
	className?: string;
}

function StatDisplay({ title, value, className }: StatDisplayProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<p className="text-text-1 text-label1 md:text-title3">{title}</p>
			<span className="text-text-1 text-heading1 md:text-title1 font-bold">
				{value}
			</span>
		</div>
	);
}
