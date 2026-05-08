import type { ReactNode } from "react";
import ProgressBar from "./progress-bar";
import { cn } from "@/shared/lib/cn";

interface LabeledProgressBarProps {
	value: number;
	barClassName?: string;
	label: ReactNode;
	valueLabel?: ReactNode;
	className?: string;
}

export default function LabeledProgressBar({
	value,
	barClassName,
	className,
	label,
	valueLabel,
}: LabeledProgressBarProps) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<div className="flex justify-between items-center">
				{label}
				{valueLabel}
			</div>
			<ProgressBar barClassName={barClassName} value={value} />
		</div>
	);
}
