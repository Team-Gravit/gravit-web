import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
import { useEffect, useRef } from "react";
import { type ConfirmModalRef } from "@/shared/ui/modal/ConfirmModal";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizProgressBar from "@/widgets/learning-widget/QuizProgressBar";
import ProblemStatement from "@/entities/learning/ui/ProblemStatement";
import AnswerInteraction from "@/widgets/learning-widget/AnswerInteraction";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import QuizResultWidget from "../QuizResultWidget";
import { useFetchIncorrectProblems } from "@/entities/learning/model/use-fetch-incorrect-problems";

export default function IncorrectQuizComponent({ unitId }: { unitId: string }) {
	const { data, isPending } = useFetchIncorrectProblems(Number(unitId));

	const quitModalRef = useRef<ConfirmModalRef>(null);

	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);
	const resetQuiz = useQuizSessionState((state) => state.resetQuiz);
	const resetTime = useQuizSessionState((state) => state.resetTime);
	const isQuizCompleted = useQuizSessionState((state) => state.isQuizCompleted);
	const pauseTime = useQuizSessionState((state) => state.pauseTime);

	//학습 결과 제출 상태
	const isSubmittingResult = useQuizSessionState(
		(state) => state.isSubmittingResult,
	);

	useEffect(() => {
		resetQuiz();
		resetTime();
	}, [resetQuiz, resetTime, unitId]);

	const shouldShowLoading = useMinimumLoadingTime({
		isLoading: isPending,
		minimumTime: 2000,
	});

	if (shouldShowLoading) {
		return (
			<main className="flex-grow w-full h-full flex flex-col items-center justify-start mt-10">
				<LoadingWidget />
			</main>
		);
	}

	if (!data) {
		return <div>문제가 발생했습니다.</div>;
	}

	const { problems, totalProblems } = data;
	const percent = (userAnswers.length / problems.length) * 100;

	const currentProblem = problems[currentProblemIndex];

	const handleClickQuit = () => {
		if (quitModalRef) {
			quitModalRef.current?.open();
			pauseTime();
		}
	};

	return (
		<>
			{!isQuizCompleted && (
				<div className="w-full h-screen flex flex-col">
					<QuizHeader
						learningTitle={data.unitSummary.title}
						onHandleQuit={handleClickQuit}
					/>
					<QuizProgressBar progress={`${percent}%`} />
					<main className=" bg-gray-200 flex flex-col items-center h-full">
						<div className="flex flex-col gap-15 w-full h-full max-w-[1500px] 3xl:w-[80%] pt-15 px-10 lg:px-20">
							<ProblemStatement
								problem={currentProblem}
								totalProblemsCount={totalProblems}
							/>
							<AnswerInteraction
								problem={currentProblem}
								totalProblemsCount={totalProblems}
							/>
						</div>
					</main>
				</div>
			)}

			{isSubmittingResult && (
				<h2 className="text-3xl">결과를 제출중입니다...</h2>
			)}

			{!isSubmittingResult && isQuizCompleted && <QuizResultWidget />}
		</>
	);
}
