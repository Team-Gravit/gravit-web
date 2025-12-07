import { useRouter } from "@tanstack/react-router";
import BackIcon from "@/shared/assets/icons/ic-back.svg?react";

export default function ChapterInfo({
	chapterName,
	chapterInfoText,
	showActionButtons = false,
}: {
	chapterName: string;
	chapterInfoText: string;
	showActionButtons?: boolean;
}) {
	const router = useRouter();

	const handleGoBack = () => {
		router.history.back();
	};

	return (
		<section className="w-full mb-16">
			<div className="flex items-center gap-5 mb-4">
				<button
					type="button"
					className="cursor-pointer w-10"
					onClick={handleGoBack}
				>
					<BackIcon />
				</button>
				<h2 className="inline-block text-white font-semibold text-3xl lg:text-4xl ">
					{chapterName}
				</h2>
				{showActionButtons && (
					<button
						type="button"
						className="ml-auto px-10 py-6 bg-main-1 rounded-2xl text-white font-bold text-3xl border border-white shadow-[0_0_16px_0_#c52aff] cursor-pointer"
					>
						개념노트
					</button>
				)}
			</div>
			<p className="max-w-xl text-white font-semibold text-2xl lg:text-3xl break-keep">
				{chapterInfoText}
			</p>
		</section>
	);
}
