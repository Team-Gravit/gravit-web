import { cn } from "@/shared/lib/cn";
import { cva } from "class-variance-authority";

interface DayBadgeProps {
	label: string;
	className?: string;
	status: "completed" | "today" | "upcoming";
	size?: "sm" | "md";
}

const dayBadgeVariants = cva(
	" border-[1.5px] inline-flex justify-center items-center",
	{
		variants: {
			status: {
				completed: "bg-[#FBF1FF] aspect-square border-main-1 text-main-2",
				today: "border-main-1 bg-main-1 text-white",
				upcoming: "border-gray-400 text-gray-500 ",
			},
			size: {
				sm: "h-8 w-8 rounded-sm text-sm",
				md: "h-10 w-10 rounded-lg text-base",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

export default function DayBadge({
	label,
	className,
	status,
	size = "md",
}: DayBadgeProps) {
	return (
		<span className={cn(dayBadgeVariants({ size, status }), className)}>
			{label}
		</span>
	);
}
