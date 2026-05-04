import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("inline-flex items-center rounded-full font-medium", {
	variants: {
		status: {
			completed: "bg-white border border-main-1 text-main-1",
			inProgress: "bg-main-1 text-white",
			notStarted: "bg-white border border-[#C6C6C6] text-[#A8A8A8]",
		},
		size: {
			sm: "px-3 py-0.5 text-xs",
			md: "px-4 py-1 text-base",
			lg: "px-5 py-2 text-lg",
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
