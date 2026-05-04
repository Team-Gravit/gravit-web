import BgCard from "@/shared/ui/card/bg-card";
import cardBg from "@/shared/assets/images/card-bg.webp";
import { PLANET_IMAGES } from "@/shared/assets/images/planets";
import LockIcon from "@/shared/assets/_icons/lock-icon.svg?react";

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
			className="relative h-[232px] justify-between overflow-hidden"
			backgroundImage={cardBg}
		>
			<BgCard.Header className="flex-col justify-start w-full items-start gap-1">
				<BgCard.Title className="text-white font-semibold text-xl break-keep line-clamp-2">
					{title}
				</BgCard.Title>
				<span className="font-medium text-base text-white/50">
					Lesson {lessonNum.toString().padStart(2, "0")}
				</span>
			</BgCard.Header>
			{status === "locked" ? (
				<span className="px-4 py-1 rounded-full bg-black/40 border border-gray-300 flex items-center justify-center w-fit text-gray-300 text-base font-medium gap-1">
					<LockIcon className="size-4" /> 잠김
				</span>
			) : (
				<a
					href={"./"}
					className="text-base font-medium underline underline-offset-3 text-[#FBF1FF]"
				>
					학습하러 가기 →
				</a>
			)}
			<img
				src={PLANET_IMAGES[chapterId as keyof typeof PLANET_IMAGES]}
				alt="Planet"
				className="aspect-square object-contain absolute w-1/2 right-0 bottom-0 translate-x-1/6 translate-y-1/6"
			/>
		</BgCard>
	);
}
