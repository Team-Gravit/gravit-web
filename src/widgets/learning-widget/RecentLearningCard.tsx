import LessonProgressBar from "@/entities/lesson/ui/LessonProgressBar";
import Card from "@/shared/ui/card/Card";
import backgroundImg from "./assets/learning-card-bg.webp";
import { Link } from "@tanstack/react-router";
import ArrowButton from "./assets/arrow-left.svg?react";
import InfoIcon from "./assets/info-circle.svg?react";
import Tooltip from "@/shared/ui/tooltip/Tooltip";
import { getPlanetImage } from "@/shared/lib/planet/utils";

type ChapterSummary = {
	chapterId: number;
	chapterName: string;
	totalUnits: number;
	completedUnits: number;
};

export default function RecentLearningCard({
	chapterSummary,
}: {
	chapterSummary?: ChapterSummary;
}) {
	let linkUrl = "/learn";
	let content = (
		<div className="relative flex flex-col text-white z-10 gap-2">
			<div className="flex justify-between items-center">
				<h3 className="text-[32px] font-mbc font-normal">
					새로운 학습을 시작하기
				</h3>
				<button type="button" className="cursor-pointer">
					<ArrowButton />
				</button>
			</div>

			<p className="text-2xl font-medium">
				최근에 진행한 학습 정보가 없습니다.
			</p>
		</div>
	);

	if (chapterSummary) {
		linkUrl = `/learn/${chapterSummary.chapterId}`;
		content = (
			<>
				<div className="relative z-10">
					<div className="flex justify-between items-center mb-2">
						<p className="text-white font-mbc text-lg font-normal  text-center">
							이어서 학습하기
						</p>
						<Tooltip
							button={
								<div>
									<InfoIcon className="relative w-[30px] h-[30px] cursor-pointer" />
								</div>
							}
							positionX="RIGHT"
						>
							<div className="flex items-center justify-center gap-2.5 w-[300px]">
								<InfoIcon className="w-[24px] h-[24px] shrink-0" />
								<p className="text-white text-[16px] font-normal flex-wrap">
									상처를 치료해줄 사람어디 없나 가만히 나뒀다간 끊임없이 덧나
									사랑도 사람도 너무나도 겁나
								</p>
							</div>
						</Tooltip>
					</div>
					<h3 className="text-[32px] font-mbc text-white font-normal mb-3">
						{chapterSummary.chapterName}
					</h3>
					<LessonProgressBar
						percent={
							(chapterSummary.completedUnits / chapterSummary.totalUnits) * 100
						}
						totalUnits={chapterSummary.totalUnits}
						completedUnits={chapterSummary.completedUnits}
					/>
				</div>

				<img
					src={getPlanetImage(chapterSummary.chapterId)}
					alt={`${chapterSummary.chapterName} 행성`}
					className="absolute w-3/5 top-1/3 transform right-0 translate-x-3 group-hover:-rotate-20 group-hover:scale-110 transition-all ease-out duration-500 z-0"
				></img>
			</>
		);
	}
	return (
		<Link to={linkUrl} className="h-full">
			<Card
				className="min-h-[350px] overflow-hidden group relative p-8 flex-grow bg-cover bg-center bg-no-repeat h-full cursor-pointer"
				style={{ backgroundImage: `url(${backgroundImg})` }}
			>
				<div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-all ease-out duration-500 z-5" />

				{content}
			</Card>
		</Link>
	);
}
