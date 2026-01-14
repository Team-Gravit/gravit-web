import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFetchIncorrectProblems } from "@/entities/learning/model/use-fetch-incorrect-problems";
import ProblemStatement from "@/entities/learning/ui/ProblemStatement";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import ReportModal from "@/features/quiz/ui/modal/ReportModal";
import ReportResultModal from "@/features/quiz/ui/modal/ReportResultModal";
import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizProgressBar from "@/widgets/learning-widget/QuizProgressBar";
import IncorrectInteraction from "../quiz/incorrect/IncorrectInteraction";

export default function IncorrectQuizComponent({ unitId }: { unitId: string }) {
	const { data, isPending } = useFetchIncorrectProblems(Number(unitId));

	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);
	const resetQuiz = useQuizSessionState((state) => state.resetQuiz);
	const resetTime = useQuizSessionState((state) => state.resetTime);
	const isQuizCompleted = useQuizSessionState((state) => state.isQuizCompleted);
	const router = useRouter();

	useEffect(() => {
		resetQuiz();
		resetTime();
	}, [resetQuiz, resetTime]);

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

	const { problems, totalProblems, unitSummary } = data;
	const percent = (userAnswers.length / problems.length) * 100;

	const currentProblem = problems[currentProblemIndex];
	const unitIdNum = unitSummary.unitId;

	const handleClickQuit = () => {
		router.history.back();
	};

	return (
		<>
			<ReportModal problemId={currentProblem.problemId} />
			<ReportResultModal type="confirm" />
			{!isQuizCompleted && (
				<div className="w-full h-screen flex flex-col">
					<QuizHeader
						onHandleQuit={handleClickQuit}
						learningTitle={data.unitSummary.title}
					/>
					<QuizProgressBar progress={`${percent}%`} />
					<main className=" bg-gray-200 flex flex-col items-center h-full">
						<div className="flex flex-col gap-15 w-full h-full max-w-[1500px] 3xl:w-[80%] pt-15 px-10 lg:px-20">
							<ProblemStatement
								problem={currentProblem}
								totalProblemsCount={totalProblems}
							/>
							<IncorrectInteraction
								problem={currentProblem}
								totalProblemsCount={totalProblems}
								unitId={unitIdNum}
							/>
						</div>
					</main>
				</div>
			)}
		</>
	);
}
