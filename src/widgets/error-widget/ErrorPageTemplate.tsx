import type { ReactNode } from "react";

interface ErrorPageTemplateProps {
	icon: ReactNode;
	title: string;
	description: ReactNode;
	children: ReactNode;
}

export default function ErrorPageTemplate({
	icon,
	title,
	description,
	children,
}: ErrorPageTemplateProps) {
	return (
		<div className="flex flex-col w-screen h-screen items-center justify-center gap-9">
			<section className="flex flex-col items-center gap-10">
				{/* 전달받은 아이콘 렌더링 */}
				{icon}

				<div className="flex flex-col items-center gap-5">
					<h2 className="text-gray-900 font-semibold text-2xl">{title}</h2>
					<p className="text-gray-600 text-xl text-center">{description}</p>
				</div>
			</section>

			<section className="flex items-center gap-6">{children}</section>
		</div>
	);
}
