import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";

export default function LessonProgressBar({
	percent,
	totalUnits,
	completedUnits,
}: {
	percent: number;
	totalUnits: number;
	completedUnits: number;
	className?: string;
}) {
	return (
		<div className={"flex flex-col gap-2"}>
			<ProgressBar
				percent={percent}
				barClassName={"bg-main-1"}
				containerClassName="bg-[#EEEEEE] h-4 w-[50%]"
			/>
			<span className="text-white text-xl font-normal">
				{completedUnits}/{totalUnits}
			</span>
		</div>
	);
}
