import { useEffect } from "react";
import type { Problem } from "@/entities/learning/model/types";
import ProblemStatement from "@/entities/learning/ui/ProblemStatement";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import ReportModal from "@/features/quiz/ui/modal/ReportModal";
import ReportResultModal from "@/features/quiz/ui/modal/ReportResultModal";
import type { UnitSummary } from "@/shared/api/@generated";
import AnswerInteraction from "@/widgets/learning-widget/AnswerInteraction";
import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizProgressBar from "@/widgets/learning-widget/QuizProgressBar";

export default function BaseQuizComponent({
	data,
	isPending,
	onQuit,
	additionalModals,
	resultComponent,
}: {
	data:
		| { problems: Problem[]; unitSummary: UnitSummary; totalProblems: number }
		| undefined;
	isPending: boolean;
	onQuit: () => void;
	additionalModals?: React.ReactNode;
	resultComponent?: React.ReactNode;
}) {
	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);
	const isSubmittingResult = useQuizSessionState(
		(state) => state.isSubmittingResult,
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
		return <div>문제가 없습니다</div>;
	}

	const { problems, totalProblems, unitSummary } = data;
	const percent = (userAnswers.length / problems.length) * 100;

	const currentProblem = problems[currentProblemIndex];
	const unitIdNum = unitSummary.unitId;

	if (!unitIdNum) {
		return <div>올바르지 않은 유닛 아이디입니다.</div>;
	}

	return (
		<>
			<ReportModal problemId={currentProblem.problemId} />
			<ReportResultModal type="confirm" />
			{additionalModals}
			{!isQuizCompleted && (
				<div className="w-full h-screen flex flex-col">
					<QuizHeader
						learningTitle={data.unitSummary.title}
						onHandleQuit={onQuit}
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
								unitId={unitIdNum}
							/>
						</div>
					</main>
				</div>
			)}
			{!isSubmittingResult && isQuizCompleted && resultComponent}
		</>
	);
}
