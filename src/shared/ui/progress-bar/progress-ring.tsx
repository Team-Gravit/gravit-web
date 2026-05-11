import { cn } from "@/shared/lib/cn";
import { useId } from "react";

interface ProgressRingProps {
	children?: React.ReactNode;
	value: number;
	size?: number;
	strokeWidth?: number;
	strokeClassName?: string;
}

export default function ProgressRing({
	children,
	value,
	size = 64,
	strokeWidth = 3,
	strokeClassName,
}: ProgressRingProps) {
	const safeValue = Math.min(Math.max(value, 0), 100);

	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference + (safeValue / 100) * circumference;

	const gradientId = useId();

	return (
		<div
			style={{
				width: size,
				height: size,
			}}
			className={cn("relative  inline-flex items-center justify-center")}
		>
			<svg
				style={{
					width: size,
					height: size,
				}}
				className="inset-0 absolute -rotate-90"
			>
				<linearGradient id={gradientId} x1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#8100B3" />
					<stop offset="100%" stopColor="#DD00FF" />
				</linearGradient>

				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
					fill="none"
					className="stroke-gray-200"
				/>

				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={`url(#${gradientId})`}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					className={cn("transition-all", strokeClassName)}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					fill="none"
				/>
			</svg>

			<div className="size-30 overflow-hidden p-1.5 inline-flex items-center justify-center">
				{children}
			</div>
		</div>
	);
}
