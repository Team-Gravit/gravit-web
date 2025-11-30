import cardBackground from "@/shared/assets/images/card-bg.webp";
import InfoCircle from "@/shared/assets/icons/info-circle.svg?react";
import LessonProgressBar from "@/entities/learning/ui/LessonProgressBar";
import { getPlanetImage } from "@/shared/lib/planet/utils";
import Tooltip from "@/shared/ui/tooltip/Tooltip";
import type { Chapter } from "@/entities/learning/model/types";

function ChapterCard({ chapter }: { chapter: Chapter }) {
	const { chapterId, title, description, progressRate } = chapter;
	return (
		<article
			key={chapterId}
			className="cursor-pointer relative flex flex-col justify-between lg:justify-start w-full h-64 lg:h-fit lg:aspect-square bg-cover bg-center rounded-[10px] overflow-hidden p-4 group shadow-[4px_4px_4px_0px_rgba(0,0,0,0.1)]"
			style={{ backgroundImage: `url(${cardBackground})` }}
		>
			<div className="flex flex-row justify-between lg:mb-3 z-10">
				<h3 className="text-3xl xl:text-4xl font-mbc text-white">{title}</h3>
				<Tooltip
					button={
						<div>
							<InfoCircle className="relative ml-auto mt-0.5 w-7 h-7 mb-0" />
						</div>
					}
					positionX="RIGHT"
				>
					<div className="relative z-50 flex items-center justify-center gap-2.5 w-[300px]">
						<InfoCircle className="w-7 h-7 shrink-0" />
						<p className="text-white text-[16px] font-normal flex-wrap">
							{description}
						</p>
					</div>
				</Tooltip>
			</div>
			<LessonProgressBar progressRate={progressRate} className="w-full" />
			<img
				src={getPlanetImage(chapterId)}
				className="absolute w-[60%] h-auto lg:w-[65%] top-1/3 transform right-0 translate-x-3 lg:top-1/2 lg:translate-x-7 group-hover:-rotate-20 group-hover:scale-110 transition-all ease-out duration-500"
				alt={`${title} 행성`}
			/>
			<div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-all ease-out duration-500 z-0"></div>
		</article>
	);
}

export default ChapterCard;
