import { cn } from "@/shared/lib/cn";
import { cva } from "class-variance-authority";

interface DayBadgeProps {
	label: string;
	className?: string;
	status: "completed" | "today" | "upcoming";
}

const dayBadgeVariants = cva(
	"h-8 w-8 rounded-sm text-sm md:h-10 md:w-10 md:rounded-lg md:text-base border-[1.5px] inline-flex justify-center items-center",
	{
		variants: {
			status: {
				completed: "bg-[#FBF1FF] aspect-square border-main-1 text-main-2",
				today: "border-main-1 bg-main-1 text-white",
				upcoming: "border-gray-400 text-gray-500 ",
			},
		},
	},
);

export default function DayBadge({ label, className, status }: DayBadgeProps) {
	return (
		<span className={cn(dayBadgeVariants({ status }), className)}>{label}</span>
	);
}
