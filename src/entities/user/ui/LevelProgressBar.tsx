import { cn } from "@/shared/lib/cn";
import ProgressBar from "@/shared/ui/progress-bar/ProgressBar";

type LevelProgressBarProps = {
	percent: number;
	level: number;
};

const LevelProgressBar = ({ percent, level }: LevelProgressBarProps) => {
	return (
		<div className="relative flex-grow flex-1 h-full rounded-full overflow-hidden min-h-[30px]">
			<ProgressBar
				percent={percent}
				barStyle={{
					background: `linear-gradient(0deg, rgba(255,255,255,0.2) 0%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(45deg, var(--color-main-2), var(--color-main-end))`,
				}}
				containerClassName="bg-white"
			/>

			<p
				className={cn(
					"absolute inset-y-0 left-5 text-3xl font-bold inline-flex items-center h-full text-white",
					percent < 20 && "text-stroke-gradient",
				)}
			>
				<span className="font-medium">LV </span>
				{level ?? 12}
			</p>
		</div>
	);
};
export default LevelProgressBar;
