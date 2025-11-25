import { cn } from "@/shared/lib/cn";
import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";

export default function LessonProgressBar({
	progressRate,
	className,
}: {
	progressRate: number;
	className?: string;
}) {
	return (
		<div className={"relative z-30 flex flex-col gap-2"}>
			<ProgressBar
				percent={progressRate}
				barClassName={"bg-main-1"}
				containerClassName={cn("bg-[#EEEEEE] h-5 w-[50%]", className)}
			/>
			<span className="text-white text-2xl">{progressRate}%</span>
		</div>
	);
}
