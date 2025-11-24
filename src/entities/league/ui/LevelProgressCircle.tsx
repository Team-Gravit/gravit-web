import { useId } from "react";
import { getLevelInfo } from "@/shared/lib/levelTable";

interface LevelProgressCircleProps {
	xp: number;
	children?: React.ReactNode;
}

export default function LevelProgressCircle({
	xp,
	children,
}: LevelProgressCircleProps) {
	const size = 60;
	const strokeWidth = 4;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const { level, progress } = getLevelInfo(xp);

	const dashOffset = circumference * (1 - progress);
	const uniqueId = useId();
	const gradientId = `levelGradient-${uniqueId}`;
	const titleId = `levelProgressTitle-${uniqueId}`;

	return (
		<div className="relative w-[60px] h-[60px] flex items-center justify-center">
			<div className="absolute inset-0 flex items-center justify-center z-0">
				{children}
			</div>

			<svg
				width={size}
				height={size}
				className="absolute top-0 left-0 z-10"
				style={{ transform: "rotate(90deg) scale(-1, 1)" }}
				role="img"
				aria-labelledby={titleId}
			>
				<title id={titleId}>{`Level ${level} progress`}</title>

				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
					fill="none"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={`url(#${gradientId})`}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
					strokeLinecap="round"
					className="transition-all duration-500 ease-out"
				/>

				<defs>
					<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#8100B3" />
						<stop offset="100%" stopColor="#DD00FF" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);
}
