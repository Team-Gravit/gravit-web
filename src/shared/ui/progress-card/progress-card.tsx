import { cn } from "@/shared/lib/cn";
import ProgressBar from "../progress-bar/progress-bar";

type Props = {
	leftSlot: React.ReactNode;
	value: number;
	max: number;
	unit: string;
	className?: string;
};

export const ProgressCard = ({
	leftSlot,
	value,
	max,
	unit,
	className,
}: Props) => (
	<div className={cn("flex flex-col gap-2", className)}>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">{leftSlot}</div>
			<span className="text-gray-500 text-body1-normal">
				<span className="text-main">{value}</span> / {max} {unit}
			</span>
		</div>
		<ProgressBar value={Math.floor((value / max) * 100)} />
	</div>
);
