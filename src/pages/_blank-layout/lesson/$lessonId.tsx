import { useFetchProblems } from "@/entities/learning/model/hooks";
import { useQuizStateStore } from "@/features/quiz/model/store";
import LessonProgressBar from "@/widgets/learning-widget/LessonProgressBar";
import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import QuizAnswer from "@/widgets/learning-widget/QuizAnswer";
import QuizHeader from "@/widgets/learning-widget/QuizHeader";
import QuizReview from "@/widgets/learning-widget/QuizReview";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import QuestionContent from "@/entities/learning/ui/QuestionContent";
import ReportButton from "@/features/quiz/submit-report/ui/ReportButton";
import {
	ConfirmModal,
	type ConfirmModalRef,
} from "@/shared/ui/modal/ConfirmModal";
import {
	ReportModal,
	type ReportType,
} from "@/features/quiz/submit-report/ui/ReportModal";
import { quizApi } from "@/features/quiz/api/api";
import QuizResultWidget from "@/widgets/learning-widget/QuizResultWidget";
import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";

export const Route = createFileRoute("/_blank-layout/lesson/$lessonId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { lessonId } = Route.useParams();
	const quitModalRef = useRef<ConfirmModalRef>(null);
	const reportModalRef = useRef<ConfirmModalRef>(null);
	const navigate = useNavigate();

	const userAnswers = useQuizStateStore((state) => state.userAnswers);
	const currentProblemIndex = useQuizStateStore(
		(state) => state.currentProblemIndex,
	);
	const resetQuiz = useQuizStateStore((state) => state.resetQuiz);
	const isQuizCompleted = useQuizStateStore((state) => state.isQuizCompleted);
	const pauseTime = useQuizStateStore((state) => state.pauseTime);
	const resumeTime = useQuizStateStore((state) => state.resumeTime);
	const resetTime = useQuizStateStore((state) => state.resetTime);

	const {
		chapterId,
		problems,
		totalCount,
		isPending,
		error,
		isError,
		lessonName,
	} = useFetchProblems(Number(lessonId));

	useEffect(() => {
		resetQuiz();
	}, [resetQuiz]);

	const isSubmitted = userAnswers.length !== currentProblemIndex;

	const shouldShowLoading = useMinimumLoadingTime({
		isLoading: isPending,
		minimumTime: 2000,
	});

	if (shouldShowLoading) {
		return (
			<main className="flex-grow flex flex-col items-center">
				<LoadingWidget />
			</main>
		);
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (!problems) {
		return <div>문제를 불러오지 못했습니다.</div>;
	}

	const activeQuestionIndex = userAnswers.length;

	if (!problems || !lessonName || !chapterId) {
		return <div>문제를 불러오지 못했습니다.</div>;
	}

	const percent = (userAnswers.length / problems.length) * 100;

	const handleClickQuit = () => {
		if (quitModalRef) {
			quitModalRef.current?.open();
			pauseTime();
		}
	};

	const handleClickReport = () => {
		if (reportModalRef) {
			reportModalRef.current?.open();
			pauseTime();
		}
	};

	return (
		<>
			{!isQuizCompleted && (
				<>
					<QuizHeader lessonName={lessonName} onHandleQuit={handleClickQuit} />
					<LessonProgressBar progress={`${percent}%`} />
					<main className="flex-grow bg-gray-200 pt-6 px-10 lg:px-[126px] flex justify-center">
						<ConfirmModal
							ref={quitModalRef}
							title={["지금까지 푼 내역이", "모두 사라져요!"]}
							description={[
								"자료구조 학습 출제가 중단됩니다",
								"정말 학습을 그만두시나요?",
							]}
							confirmText="그만두기"
							cancelText="계속하기"
							onConfirm={() => {
								resetQuiz();
								resetTime();
								navigate({
									to: "/learn/$chapterId",
									params: { chapterId: chapterId.toString() },
								});
							}}
							onCancel={() => {
								resumeTime();
								console.log("닫힘!");
							}}
						/>
						<ReportModal
							ref={reportModalRef}
							onSubmit={async (reportType: ReportType, content: string) => {
								const trimmedContent = content.trim() === "" ? "-" : content;

								await quizApi.submitReport({
									reportType,
									content: trimmedContent,
									problemId: problems[currentProblemIndex].problemId,
								});
							}}
							onCancel={() => resumeTime()}
						/>

						<div
							className="relative max-w-[1188px] w-full h-full flex flex-col gap-15"
							key={problems[currentProblemIndex].problemId}
						>
							<ReportButton
								className={"absolute right-0 top-0 cursor-pointer"}
								onHandleClickReport={handleClickReport}
							/>
							<div className="w-full">
								<QuestionContent
									totalProblemsCount={totalCount}
									content={problems[currentProblemIndex].content}
									question={problems[currentProblemIndex].question}
								/>
							</div>
							{!isSubmitted && (
								<QuizAnswer
									problemId={problems[currentProblemIndex].problemId}
									problemType={
										problems[currentProblemIndex].problemType as
											| "SUBJECTIVE"
											| "OBJECTIVE"
									}
									options={problems[currentProblemIndex].options}
									answer={problems[currentProblemIndex].answer}
								/>
							)}
							{isSubmitted && (
								<QuizReview
									isLastQuestion={activeQuestionIndex === problems.length}
									answer={problems[currentProblemIndex].answer
										.split(",")
										.map((s) => s.trim())}
									options={problems[currentProblemIndex].options}
									userAnswer={userAnswers[userAnswers.length - 1]}
								/>
							)}
						</div>
					</main>
				</>
			)}
			{isQuizCompleted && (
				<QuizResultWidget lessonId={lessonId} chapterId={String(chapterId)} />
			)}
		</>
	);
}
