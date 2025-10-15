import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

interface FormProps {
	children?: ReactNode;
	className?: string;
	darkMode?: boolean;
}

export default function Form({
	children,
	className,
	darkMode = false,
}: FormProps) {
	return (
		<section
			className={cn(
				darkMode
					? `
            box-border flex flex-col items-center 
            rounded-xl border-2 border-[#8B69FF]
            shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)]
            [backdrop-filter:blur(50px)]
            bg-[linear-gradient(108.74deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_100%)]
          `
					: `
            box-border flex flex-col items-center 
            rounded-xl border-0
            shadow-[0_0_20px_-10px_rgba(0,0,0,0.1)]
            bg-white
          `,
				className,
			)}
		>
			{children}
		</section>
	);
}
