import ProgressBar from "./progress-bar";
import { cn } from "@/shared/lib/cn";

interface LabeledProgressBarProps {
	value: number;
	label: string;
	className?: string;
	barClassName?: string;
	labelClassName?: string;
}

export default function LabeledProgressBar({
	value,
	label,
	className,
	barClassName,
	labelClassName,
}: LabeledProgressBarProps) {
	return (
		<div className={cn("flex flex-col gap-1 md:gap-1.5", className)}>
			<div className="flex justify-between items-center">
				<span className={cn(labelClassName ? labelClassName : "text-heading1")}>
					{label}
				</span>
				<span className="text-main-1">{`${value}%`}</span>
			</div>
			<ProgressBar barClassName={barClassName} value={value} />
		</div>
	);
}
