import { useFetchProblems } from "@/entities/learning/model/hooks";
import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
import { useEffect } from "react";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizProgressBar from "@/widgets/learning-widget/QuizProgressBar";
import ProblemStatement from "@/entities/learning/ui/ProblemStatement";
import AnswerInteraction from "@/widgets/learning-widget/AnswerInteraction";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import QuizResultWidget from "../QuizResultWidget";
import ReportModal from "@/features/quiz/ui/modal/ReportModal";
import ReportResultModal from "@/features/quiz/ui/modal/ReportResultModal";
import { LessonQuitModal } from "@/features/quiz/ui/modal/LessonQuitModal";
import { useLessonModalStore } from "@/features/quiz/model/use-lesson-modal-store";

export default function LessonQuizComponent({
	lessonId,
}: {
	lessonId: string;
}) {
	const { data, isPending } = useFetchProblems(Number(lessonId));

	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);

	const { openQuitModal } = useLessonModalStore();
	const resetQuiz = useQuizSessionState((state) => state.resetQuiz);
	const resetTime = useQuizSessionState((state) => state.resetTime);
	const isQuizCompleted = useQuizSessionState((state) => state.isQuizCompleted);

	//학습 결과 제출 상태
	const isSubmittingResult = useQuizSessionState(
		(state) => state.isSubmittingResult,
	);

	const handleClickQuit = () => {
		openQuitModal();
	};

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
	const unitId = unitSummary.unitId;

	return (
		<>
			<ReportModal problemId={currentProblem.problemId} />
			<ReportResultModal type="confirm" />
			<LessonQuitModal />

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
								unitId={unitId}
							/>
						</div>
					</main>
				</div>
			)}
			{!isSubmittingResult && isQuizCompleted && <QuizResultWidget />}
		</>
	);
}
