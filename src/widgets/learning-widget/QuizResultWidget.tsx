import { Link, useRouter } from "@tanstack/react-router";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import Mascot from "@/shared/assets/icons/end-mascot.svg?react";
import bookImg from "@/shared/assets/images/books.png";
import playImg from "@/shared/assets/images/play.png";
import { StatCard } from "@/shared/ui/card/StatCard";
import LearningProgressInfo from "@/widgets/learning-widget/LearningProgressInfo";
import formatTime from "./lib/formatTime";

export default function QuizResultWidget() {
	const router = useRouter();

	// Store에서 필요한 데이터 추출
	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const timeElapsed = useQuizSessionState((state) => state.timeElapsed);
	const submitResponse = useQuizSessionState((state) => state.submitResponse);

	// 정답률 계산
	const correctCount = userAnswers.filter((answer) => answer.isCorrect).length;
	const accuracy = Math.round((correctCount / userAnswers.length) * 100);

	// 서버 응답 데이터 사용
	const xp = submitResponse?.userLevelResponse?.xp ?? 0;
	const league = submitResponse?.leagueName ?? "브론즈";
	const level = submitResponse?.userLevelResponse?.currentLevel ?? 1;
	const unitTitle = submitResponse?.unitSummary?.title ?? "자료구조";
	const correctRate = accuracy;

	return (
		<div className="flex-grow flex flex-col items-center bg-gray-200 gap-10">
			<header className="w-full flex flex-row items-center bg-white justify-center px-5 py-7 text-[#030303] font-semibold text-2xl">
				{unitTitle}
			</header>
			<main className="max-w-[1148px] w-full h-full flex flex-col gap-10 transition-all duration-500 ease-in-out">
				<section className="w-full flex flex-col lg:flex-row lg:justify-between gap-10">
					<div className="flex flex-col items-center gap-4">
						<h2 className="text-neutral-100 text-3xl lg:text-4xl font-semibold">
							{unitTitle} 학습을 완료했어요!
						</h2>
						<p className="text-gray-600 text-2xl lg:text-3xl font-normal">
							다음 레슨을 풀러 가볼까요?
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
				<LearningProgressInfo xp={xp} league={league} level={level} />
				<section className="w-full h-[60px] lg:h-[80px] grid grid-cols-2 gap-6">
					<Link
						to={"/main"}
						className="gray-btn cursor-pointer text-2xl lg:text-3xl font-semibold flex items-center justify-center"
					>
						메인으로 가기
					</Link>
					<button
						type="button"
						onClick={() => {
							router.history.back();
						}}
						className="primary-btn cursor-pointer text-2xl lg:text-3xl font-semibold flex items-center justify-center"
					>
						계속하기
					</button>
				</section>
			</main>
		</div>
	);
}
