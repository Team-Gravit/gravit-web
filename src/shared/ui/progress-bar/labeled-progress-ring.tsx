import type { ReactNode } from "react";
import ProgressRing from "./progress-ring";
import { cn } from "@/shared/lib/cn";

interface LabeledProgressRingProps {
	value: number;
	label: string;
	content?: ReactNode;
	size?: "sm" | "md" | "lg";
	className?: string;
	labelClassName?: string;
}

export default function LabeledProgressRing({
	value,
	label,
	content,
	className,
	labelClassName,
	size = "sm",
}: LabeledProgressRingProps) {
	const labeledProgressRingSize = {
		sm: {
			ringSize: 44,
			gapSize: "gap-4",
			labelSize: "text-xl",
		},
		md: {
			ringSize: 64,
			gapSize: "gap-4",
			labelSize: "text-3xl",
		},
		lg: {
			ringSize: 80,
			gapSize: "gap-4",
			labelSize: "text-5xl",
		},
	};

	return (
		<div
			className={cn(
				"flex items-center",
				labeledProgressRingSize[size].gapSize,
				className,
			)}
		>
			<ProgressRing value={value} size={labeledProgressRingSize[size].ringSize}>
				{content}
			</ProgressRing>

			<span
				className={cn(
					`${labeledProgressRingSize[size].labelSize}`,
					labelClassName,
				)}
			>
				{label}
			</span>
		</div>
	);
}
