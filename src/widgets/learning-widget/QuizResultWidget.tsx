import LearningProgressInfo from "@/widgets/learning-widget/LearningProgressInfo";
import Mascot from "@/shared/assets/icons/end-mascot.svg?react";
import { StatCard } from "@/shared/ui/card/StatCard";
import bookImg from "@/shared/assets/images/books.png";
import playImg from "@/shared/assets/images/play.png";
import { Link } from "@tanstack/react-router";
import { useSubmitQuizResult } from "@/features/quiz/model/useSubmitQuizResult";
import { useEffect } from "react";
import type { SubmitResultRequestDTO } from "@/features/quiz/api/dto";
import { useQuizStateStore } from "@/features/quiz/model/store";
import formatTime from "./lib/formatTime";

export default function QuizResultWidget({
	lessonId,
	chapterId,
}: {
	lessonId: string;
	chapterId: string;
}) {
	const {
		mutate: submitResult,
		data: resultData,
		isPending,
		isError,
	} = useSubmitQuizResult();

	const userAnswers = useQuizStateStore((state) => state.userAnswers);
	const timeElapsed = useQuizStateStore((state) => state.timeElapsed);

	const accuracy = Math.round(
		(userAnswers.filter((answer) => answer.isCorrect).length /
			userAnswers.length) *
			100,
	);

	useEffect(() => {
		const submitData: SubmitResultRequestDTO = {
			lessonId: Number(lessonId),
			learningTime: timeElapsed,
			accuracy: accuracy,
			problemResults: userAnswers.map((answer) => ({
				problemId: answer.problemId,
				isCorrect: answer.isCorrect,
				incorrectCounts: 1,
			})),
		};

		submitResult(submitData);
	}, [submitResult, lessonId, userAnswers, timeElapsed, accuracy]);

	if (isPending) {
		return (
			<main className="flex-grow flex flex-col items-center">
				<div>로딩</div>
			</main>
		);
	}

	if (isError) {
		return (
			<main className="flex-grow flex flex-col items-center">
				<div>결과 제출에 실패했습니다. 다시 시도해주세요.</div>
			</main>
		);
	}

	const xp = resultData?.xp || 10;
	const league = resultData?.leagueName || "브론즈";
	const level = resultData?.currentLevel || 10;
	const correctRate = accuracy || 0;
	const solveTime = timeElapsed;

	return (
		<main className="flex-grow flex flex-col items-center bg-gray-200 px-[146px] pt-[65px] pb-[88px]">
			<div className="max-w-[1148px] w-full h-full flex flex-col gap-10">
				<LearningProgressInfo xp={xp} league={league} level={level} />
				<section className="w-full flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-10">
					<div className="flex flex-col items-center">
						<h2 className="text-neutral-100 text-3xl lg:text-4xl font-semibold mb-4">
							지구에 한발 더 가까워졌어요!
						</h2>
						<p className="text-gray-600 text-2xl lg:text-3xl font-normal">
							자료구조의 3번째 단계를 학습을 완료했어요
						</p>
						<Mascot className="w-[250px] lg:w-[300px] lg:mt-5" />
					</div>
					<div className="flex flex-col gap-4 flex-grow lg:max-w-[470px]">
						<StatCard
							icon={bookImg}
							label={"정답률"}
							value={`${String(correctRate)}%`}
							size="lg"
						/>
						<StatCard
							icon={playImg}
							label={"풀이시간"}
							value={formatTime(solveTime)}
							size="lg"
						/>
					</div>
				</section>
				<section className="w-full h-[60px] lg:h-[80px] grid grid-cols-2 gap-6">
					<Link
						to={"/main"}
						className="gray-btn cursor-pointer text-2xl lg:text-3xl font-semibold flex items-center justify-center"
					>
						메인으로 가기
					</Link>
					<Link
						to={"/learn/$chapterId"}
						params={{ chapterId: chapterId }}
						className="primary-btn cursor-pointer text-2xl lg:text-3xl font-semibold flex items-center justify-center"
					>
						계속하기
					</Link>
				</section>
			</div>
		</main>
	);
}
