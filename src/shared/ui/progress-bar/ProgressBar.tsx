import type { CSSProperties } from "react";
import { cn } from "@/shared/lib/cn";

type ProgressBarProps = {
	percent: number;
	containerClassName?: string;
	barClassName?: string;
	barStyle?: CSSProperties;
	containerStyle?: CSSProperties;
};

export default function ProgressBar(props: ProgressBarProps) {
	const {
		percent,
		containerClassName,
		barClassName,
		barStyle,
		containerStyle,
	} = props;

	return (
		<div
			className={cn(
				"relative rounded-full overflow-hidden h-full w-full",
				containerClassName,
			)}
			style={containerStyle}
		>
			<div
				className={cn(
					"h-full transition-all duration-300 rounded-r-full",
					barClassName,
				)}
				style={{
					width: `${Math.min(Math.max(percent, 0), 100)}%`,
					...barStyle,
				}}
			/>
		</div>
	);
}
