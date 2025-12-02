import { useFetchProblems } from "@/entities/learning/model/hooks";
import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
import { useEffect, useRef } from "react";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizProgressBar from "@/widgets/learning-widget/QuizProgressBar";
import ProblemStatement from "@/entities/learning/ui/ProblemStatement";
import AnswerInteraction from "@/widgets/learning-widget/AnswerInteraction";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import QuizResultWidget from "../QuizResultWidget";
import {
	ConfirmModal,
	type ConfirmModalRef,
} from "@/shared/ui/modal/ConfirmModal";
import ReportButton from "@/features/quiz/submit-report/ui/ReportButton";
import { useRouter } from "@tanstack/react-router";

export default function LessonQuizComponent({
	lessonId,
}: {
	lessonId: string;
}) {
	const { data, isPending } = useFetchProblems(Number(lessonId));
	const router = useRouter();

	const quitModalRef = useRef<ConfirmModalRef>(null);

	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);
	const resetQuiz = useQuizSessionState((state) => state.resetQuiz);
	const resetTime = useQuizSessionState((state) => state.resetTime);
	const isQuizCompleted = useQuizSessionState((state) => state.isQuizCompleted);
	const pauseTime = useQuizSessionState((state) => state.pauseTime);
	const resumeTime = useQuizSessionState((state) => state.resumeTime);

	//학습 결과 제출 상태
	const isSubmittingResult = useQuizSessionState(
		(state) => state.isSubmittingResult,
	);

	useEffect(() => {
		resetQuiz();
		resetTime();
	}, [resetQuiz, resetTime, lessonId]);

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
					<ConfirmModal
						ref={quitModalRef}
						title={["지금까지 푼 내역이", "모두 사라져요!"]}
						description={["학습이 중단됩니다", "정말 학습을 그만두시나요?"]}
						confirmText="그만두기"
						cancelText="계속하기"
						onConfirm={() => {
							resetQuiz();
							resetTime();
							router.history.back();
						}}
						onCancel={() => {
							resumeTime();
						}}
					/>

					<QuizHeader
						learningTitle={unitSummary.title}
						onHandleQuit={handleClickQuit}
					/>
					<QuizProgressBar progress={`${percent}%`} />
					<main className=" bg-gray-200 flex flex-col items-center h-full">
						<div className="flex flex-col gap-15 w-full h-full max-w-[1500px] 3xl:w-[80%] pt-15 px-10 lg:px-20 relative">
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
