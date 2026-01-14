import { Link } from "@tanstack/react-router";
import LessonProgressBar from "@/entities/learning/ui/LessonProgressBar";
import InfoIcon from "@/shared/assets/icons/info-circle.svg?react";
import { getPlanetImage } from "@/shared/lib/planet/utils";
import Card from "@/shared/ui/card/Card";
import Tooltip from "@/shared/ui/tooltip/Tooltip";
import ArrowButton from "./assets/arrow-left.svg?react";
import backgroundImg from "./assets/learning-card-bg.webp";

type RecentLearningSummary =
	| {
			recentSolvedChapterId: number;
			recentSolvedChapterTitle: string;
			recentSolvedChapterDescription: string;
			recentSolvedChapterProgressRate: number;
	  }
	| undefined;

export default function RecentLearningCard({
	learningSummary,
}: {
	learningSummary: RecentLearningSummary;
}) {
	let linkUrl = "/learning";
	let content = (
		<div className="relative flex flex-col text-white z-10 gap-2">
			<div className="flex justify-between items-center">
				<p className="text-3xl font-semibold">
					최근에 진행한 학습 정보가 없습니다.
				</p>
				<button type="button" className="cursor-pointer">
					<ArrowButton />
				</button>
			</div>

			<h3 className="text-[40px] font-mbc font-normal">
				새로운 학습을 시작하기
			</h3>
		</div>
	);

	if (learningSummary) {
		linkUrl = `/learning/${learningSummary.recentSolvedChapterId}`;
		content = (
			<>
				<div className="relative z-10">
					<div className="flex justify-between items-center mb-2">
						<p className="text-white text-3xl font-semibold text-center">
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
									{learningSummary.recentSolvedChapterDescription}
								</p>
							</div>
						</Tooltip>
					</div>
					<h3 className="text-[40px] font-mbc text-white font-normal mb-4">
						{learningSummary.recentSolvedChapterTitle}
					</h3>
					<LessonProgressBar
						progressRate={learningSummary.recentSolvedChapterProgressRate}
					/>
				</div>

				<img
					src={getPlanetImage(learningSummary.recentSolvedChapterId)}
					alt={`${learningSummary.recentSolvedChapterTitle} 행성`}
					className="absolute w-3/5 top-1/3 transform right-0 translate-x-3 group-hover:-rotate-20 group-hover:scale-110 transition-all ease-out duration-500 z-0"
				></img>
			</>
		);
	}
	return (
		<Link to={linkUrl} className="h-full">
			<Card
				className="min-h-[350px] overflow-hidden group relative p-10 flex-grow bg-cover bg-center bg-no-repeat h-full cursor-pointer"
				style={{ backgroundImage: `url(${backgroundImg})` }}
			>
				<div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-all ease-out duration-500 z-5" />

				{content}
			</Card>
		</Link>
	);
}
