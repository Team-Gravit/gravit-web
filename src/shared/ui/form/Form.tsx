import type { ReactNode } from "react";

interface FormProps {
	children?: ReactNode;
	className?: string;
}

export default function Form({ children, className }: FormProps) {
	return (
		<section
			className={`
        box-border flex flex-col items-center 
        rounded-xl border-2 border-[#8B69FF]
        shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)]
        [backdrop-filter:blur(50px)]
        ${className ?? ""}
      `}
			style={{
				background:
					"linear-gradient(108.74deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 100%)",
			}}
		>
			{children}
		</section>
	);
}
