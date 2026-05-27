import BgCard from "@/shared/ui/card/bg-card";
import cardBg from "@/shared/assets/images/card-bg.webp";
import { PLANET_IMAGES } from "@/shared/assets/images/planets";
import { Link } from "@tanstack/react-router";
import { cn } from "@/shared/lib/cn";

export default function UnitCard({
	title,
	lessonNum,
	chapterId,
	className,
}: {
	title: string;
	lessonNum: number;
	chapterId: number;
	className?: string;
}) {
	return (
		<BgCard
			className={cn(
				"relative md:h-[232px] justify-between overflow-hidden",
				className,
			)}
			backgroundImage={cardBg}
		>
			<BgCard.Header className="flex-col justify-start w-full items-start gap-1 z-10">
				<span className="text-gray-400 block md:hidden text-label2">
					새 주제 시작하기
				</span>
				<BgCard.Title className="text-headline1 text-white md:text-heading1 break-keep line-clamp-3 md:line-clamp-2">
					{title}
				</BgCard.Title>
				<span className="text-caption1 md:text-body1-normal text-gray-400">
					Lesson {lessonNum.toString().padStart(2, "0")}
				</span>
			</BgCard.Header>
			<img
				src={PLANET_IMAGES[chapterId as keyof typeof PLANET_IMAGES]}
				alt="Planet"
				className="aspect-square object-contain absolute h-[70%] md:h-fit md:w-1/2 right-0 bottom-0 translate-x-1/6 translate-y-1/6 z-0"
			/>
			{/* {status === "locked" ? (
				<span className="px-4 py-1 rounded-full bg-black/40 border border-gray-300 flex items-center justify-center w-fit text-gray-300 text-xs md:text-base font-normal md:font-medium gap-1 z-10">
					<LockIcon className="size-4" /> 잠김
				</span>
			) : ( */}
			<Link
				to={"/"}
				className="text-label1 md:text-base  md:font-medium underline underline-offset-3 text-[#FBF1FF] z-10"
			>
				학습하러 가기 →
			</Link>
			{/* )} */}
		</BgCard>
	);
}
