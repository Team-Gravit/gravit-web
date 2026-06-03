import Card from "@/shared/ui/card/card";
import CrownIcon from "@/shared/assets/icons/crown-icon.svg?react";
import type { LearningSummaryResponse } from "@/shared/api/@generated/model";
import { cn } from "@/shared/lib/cn";

export default function SummaryCard({
	learningSummary,
}: {
	learningSummary: LearningSummaryResponse;
}) {
	return (
		<Card className="w-full py-4 md:py-[33px] px-0 md:px-4">
			<div className="flex flex-col gap-2 items-center md:hidden">
				<div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center">
					<CrownIcon />
				</div>
				<div className="flex flex-col items-center">
					<h3 className="text-title3 text-main-1">
						상위 {learningSummary.topPercent}%
					</h3>
					<span className="text-caption1 text-text-4">전체 학습 순위</span>
				</div>
			</div>
			<div className="w-full flex flex-row items-center gap-0 px-4 py-3 md:px-0 md:py-0">
				<SummaryCardItem
					value={learningSummary.topPercent}
					label="학습률 상위"
					unit="%"
					className="hidden md:flex"
				/>
				<SummaryCardItem
					value={learningSummary.completedLessonCount}
					subValue={learningSummary.totalLessonCount}
					label="완료 레슨"
				/>
				<SummaryCardItem
					value={learningSummary.totalLearningHours}
					unit="h"
					label="총 학습시간"
				/>
				<SummaryCardItem
					value={learningSummary.averageAccuracy}
					unit="%"
					label="평균 정답률"
				/>
			</div>
		</Card>
	);
}
interface SummaryCardItemProps {
	value: string | number;
	subValue?: string | number;
	label: string;
	unit?: string;
	className?: string;
}

function SummaryCardItem({
	value,
	subValue,
	label,
	unit = "개",
	className,
}: SummaryCardItemProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center gap-1 flex-1 border-l border-gray-300 first:border-none",
				className,
			)}
		>
			<h3 className="text-headline2 md:text-title1 text-text-1 flex gap-1 items-baseline">
				{value}
				{unit}
				{subValue && (
					<span className="text-caption1 md:text-title3 text-text-4">
						/ {subValue}
						{unit}
					</span>
				)}
			</h3>

			<div className="text-caption1 md:text-body1-normal text-text-4">
				{label}
			</div>
		</div>
	);
}
