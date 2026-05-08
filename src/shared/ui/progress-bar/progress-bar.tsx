import { cn } from "@/shared/lib/cn";

interface ProgressBarProps {
	value: number;
	className?: string;
	barClassName?: string;
}
export default function ProgressBar({
	value,
	className,
	barClassName,
}: ProgressBarProps) {
	const safeValue = Math.min(Math.max(value, 0), 100);

	return (
		<div
			className={cn(
				"h-2 relative rounded-full w-full bg-[#FBF1FF] overflow-hidden",
				className,
			)}
		>
			<div
				style={{
					width: `${safeValue}%`,
				}}
				className={cn(
					"absolute h-full left-0 top-0 bg-main-gr rounded-full transition-all",
					barClassName,
				)}
			/>
		</div>
	);
}
