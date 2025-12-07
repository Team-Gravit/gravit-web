// src/shared/components/ErrorPageTemplate.tsx (경로는 프로젝트 구조에 맞게 설정하세요)
import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ErrorPageTemplateProps {
	icon: ReactNode;
	title: string;
	description: ReactNode;
}

export default function ErrorPageTemplate({
	icon,
	title,
	description,
}: ErrorPageTemplateProps) {
	const router = useRouter();

	const handleGoBack = () => {
		router.history.back();
	};

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

			<section className="flex items-center gap-6">
				<button
					type="button"
					onClick={handleGoBack}
					className="gray-btn py-5 px-16 text-2xl font-medium"
				>
					돌아가기
				</button>

				<Link
					to={"/main"}
					className="primary-btn py-5 px-16 text-2xl font-medium"
				>
					메인으로
				</Link>
			</section>
		</div>
	);
}
