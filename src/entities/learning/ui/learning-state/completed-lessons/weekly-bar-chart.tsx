import { cn } from "@/shared/lib/cn";

export default function WeeklyBarChart({lessonData,maxCount}: {lessonData: {day: string, count: number}[], maxCount: number}) {
	return(
		<ol className="w-full flex gap-2 md:gap-3 justify-between flex-1 mb-[42px] md:mb-0">
			{lessonData.map((data) => {
				const heightPercent = (data.count / maxCount) * 100;

				return (
					<li
						key={data.day}
						className="flex-1 h-full flex flex-col justify-end"
					>
						<LessonCompletionBar
							day={data.day}
							count={data.count}
							heightPercent={heightPercent}
						/>
					</li>
				);
			})}
		</ol>
	)
}

interface BarProps {
	day: string;
	count: number;
	heightPercent: number;
}
function LessonCompletionBar({ day, count, heightPercent }: BarProps) {
	const isEmpty = count === 0;

	return (
		<div className="flex flex-col gap-1 md:gap-2 h-40 md:h-full justify-end items-center">
			<span
				className={cn(
					"text-caption1 text-main-1",
					count === 0 && "text-text-4",
				)}
			>
				{count}개
			</span>
			<div
				className={cn("w-full rounded-lg", isEmpty ? "bg-[#d9d9d9] h-1" : "bg-main-1")}
				style={isEmpty ? undefined : { height: `${heightPercent}%` }}
			/>
			<span className="text-text-4 text-caption1">{day}</span>
		</div>
	);
}