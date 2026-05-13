import { cva } from "class-variance-authority";

const badgeVariants = cva("inline-flex items-center rounded-full font-medium", {
	variants: {
		status: {
			completed: "bg-white border border-main-1 text-main-1",
			inProgress: "bg-main-1 text-white",
			notStarted: "bg-white border border-[#C6C6C6] text-[#A8A8A8]",
		},
		size: {
			// 높이는 직접 지정할 것
			sm: "px-3 h-[22px] text-xs",
			md: "px-4 h-[29px] text-base",
			lg: "px-3 md:px-5 h-[26px] md:h-8 text-xs md:text-lg",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

interface StatusBadgeProps {
	status: "completed" | "inProgress" | "notStarted";
	size?: "sm" | "md" | "lg";
	text?: string;
}

export default function StatusBadge({
	status,
	size = "md",
	text,
}: StatusBadgeProps) {
	return <span className={badgeVariants({ status, size })}>{text}</span>;
}
