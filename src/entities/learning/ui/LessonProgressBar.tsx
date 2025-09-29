import { cn } from "@/shared/lib/cn";
import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";

export default function LessonProgressBar({
	totalUnits,
	completedUnits,
	className,
}: {
	totalUnits: number;
	completedUnits: number;
	className?: string;
}) {
	return (
		<div className={"relative z-30 flex flex-col gap-2"}>
			<ProgressBar
				percent={(completedUnits / totalUnits) * 100}
				barClassName={"bg-main-1"}
				containerClassName={cn("bg-[#EEEEEE] h-4 w-[50%]", className)}
			/>
			<span className="text-white text-xl font-normal">
				{completedUnits}/{totalUnits}
			</span>
		</div>
	);
}
