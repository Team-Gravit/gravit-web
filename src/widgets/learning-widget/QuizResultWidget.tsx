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
import { useFetchMainInfo } from "../main/model/hooks";
import { useMinimumLoadingTime } from "./lib/useMinimumLoadingTime";

export default function QuizResultWidget({
	lessonId,
	chapterId,
}: {
	lessonId: string;
	chapterId: string;
}) {
	const { data: currentUserData, isLoading: isLoadingUserData } =
		useFetchMainInfo();

	const {
		mutate: submitResult,
		data: resultData,
		isPending: isSubmitting,
		isError,
	} = useSubmitQuizResult();

	const userAnswers = useQuizStateStore((state) => state.userAnswers);
	const timeElapsed = useQuizStateStore((state) => state.timeElapsed);

	const isLoading = isSubmitting || isLoadingUserData;
	const shouldShowLoading = useMinimumLoadingTime({
		isLoading,
		minimumTime: 1500,
	});

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

	if (isError) {
		return (
			<main className="flex-grow flex flex-col items-center">
				<div>결과 제출에 실패했습니다. 다시 시도해주세요.</div>
			</main>
		);
	}

	const baseXp = currentUserData?.xp || 0;
	const baseLeague = currentUserData?.leagueName || "브론즈";
	const baseLevel = currentUserData?.level || 1;

	const xp = resultData?.xp || baseXp;
	const league = resultData?.leagueName || baseLeague;
	const level = resultData?.currentLevel || baseLevel;

	const correctRate = accuracy || 0;

	if (shouldShowLoading) {
		return (
			<main className="flex-grow flex flex-col items-center bg-gray-200 px-[146px] pt-[65px] pb-[88px]">
				<div className="max-w-[1148px] w-full h-full flex flex-col gap-10">
					<div className="animate-pulse">
						{/* 헤더 영역 */}
						<div className="h-32 bg-gray-300 rounded-lg mb-10" />

						<div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-10">
							{/* 프로필 영역 */}
							<div className="flex flex-col items-center">
								<div className="h-10 bg-gray-300 rounded w-96 mb-4" />
								<div className="h-8 bg-gray-300 rounded w-80 mb-6" />
								<div className="w-[250px] h-[250px] bg-gray-300 rounded-full" />
							</div>

							{/* 정보 카드 영역 */}
							<div className="flex flex-col gap-4 flex-grow lg:max-w-[470px]">
								<div className="h-20 bg-gray-300 rounded-lg" />
								<div className="h-20 bg-gray-300 rounded-lg" />
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="flex-grow flex flex-col items-center bg-gray-200 px-[146px] pt-[65px] pb-[88px]">
			<div className="max-w-[1148px] w-full h-full flex flex-col gap-10 transition-all duration-500 ease-in-out">
				<LearningProgressInfo xp={xp} league={league} level={level} />
				<section className="w-full flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-10">
					<div className="flex flex-col items-center">
						<h2 className="text-neutral-100 text-3xl lg:text-4xl font-semibold mb-4">
							{currentUserData?.chapterName}에 한발 더 가까워졌어요!
						</h2>
						<p className="text-gray-600 text-2xl lg:text-3xl font-normal">
							{currentUserData?.chapterName}의 3번째 단계를 학습을 완료했어요
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
							value={formatTime(timeElapsed)}
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
