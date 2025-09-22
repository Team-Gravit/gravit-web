import type { ReactNode } from "react";

interface FormProps {
	children?: ReactNode;
	className?: string;
}

export default function Form({ children, className }: FormProps) {
	return (
		<section
			className={`flex flex-col rounded-xl bg-white items-center ${className ?? ""}`}
		>
			{children}
		</section>
	);
}
