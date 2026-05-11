import BgCard from "@/shared/ui/card/bg-card";
import cardBg from "@/shared/assets/images/card-bg.webp";
import { PLANET_IMAGES } from "@/shared/assets/images/planets";
import LockIcon from "@/shared/assets/_icons/lock-icon.svg?react";
import { Link } from "@tanstack/react-router";

export default function ChapterCard({
	title,
	status,
	lessonNum,
	chapterId,
}: {
	title: string;
	status: "locked" | "unlocked";
	lessonNum: number;
	chapterId: number;
}) {
	return (
		<BgCard
			className="relative h-[185px] md:h-[232px] justify-between overflow-hidden"
			backgroundImage={cardBg}
		>
			<BgCard.Header className="flex-col justify-start w-full items-start md:gap-1">
				<span className="text-xs text-gray-400 block md:hidden">
					새 주제 시작하기
				</span>
				<BgCard.Title className="font-mbc md:font-pretendard text-white font-normal md:font-semibold text-base md:text-xl break-keep line-clamp-1 md:line-clamp-2">
					{title}
				</BgCard.Title>
				<span className="text-xs font-normal md:font-medium md:text-base text-white/50">
					Lesson {lessonNum.toString().padStart(2, "0")}
				</span>
			</BgCard.Header>
			<img
				src={PLANET_IMAGES[chapterId as keyof typeof PLANET_IMAGES]}
				alt="Planet"
				className="aspect-square object-contain absolute w-[120px] md:w-1/2 right-0 bottom-0 translate-x-1/6 translate-y-1/6"
			/>
			{status === "locked" ? (
				<span className="px-4 py-1 rounded-full bg-black/40 border border-gray-300 flex items-center justify-center w-fit text-gray-300 text-xs md:text-base font-normal md:font-medium gap-1 z-10">
					<LockIcon className="size-4" /> 잠김
				</span>
			) : (
				<Link
					to={"/"}
					className="text-xs md:text-base font-normal md:font-medium underline underline-offset-3 text-[#FBF1FF] z-10"
				>
					학습하러 가기 →
				</Link>
			)}
		</BgCard>
	);
}
