import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
import { useEffect } from "react";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizProgressBar from "@/widgets/learning-widget/QuizProgressBar";
import ProblemStatement from "@/entities/learning/ui/ProblemStatement";
import AnswerInteraction from "@/widgets/learning-widget/AnswerInteraction";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import { useFetchBookmarkedProblems } from "@/entities/learning/model/use-fetch-bookmarked-problems";
import { useRouter } from "@tanstack/react-router";
import ReportModal from "@/features/quiz/ui/modal/ReportModal";
import ReportResultModal from "@/features/quiz/ui/modal/ReportResultModal";
// import QuizResultWidget from "../QuizResultWidget";

export default function BookmarkQuizComponent({ unitId }: { unitId: string }) {
	const { data, isPending } = useFetchBookmarkedProblems(Number(unitId));

	const router = useRouter();

	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);
	const resetQuiz = useQuizSessionState((state) => state.resetQuiz);
	const resetTime = useQuizSessionState((state) => state.resetTime);

	const isQuizCompleted = useQuizSessionState((state) => state.isQuizCompleted);
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

	const { problems, totalProblems } = data;
	const percent = (userAnswers.length / problems.length) * 100;

	const currentProblem = problems[currentProblemIndex];

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
		</>
	);
}
