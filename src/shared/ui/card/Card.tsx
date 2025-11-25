import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

export default function Card({ children, className, ...props }: CardProps) {
	return (
		<div
			className={cn("bg-white rounded-2xl custom-shadow", className)}
			{...props}
		>
			{children}
		</div>
	);
}
