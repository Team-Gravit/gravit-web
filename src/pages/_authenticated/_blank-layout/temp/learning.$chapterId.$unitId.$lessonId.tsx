// import {
// 	createFileRoute,
// 	useNavigate,
// 	useParams,
// } from "@tanstack/react-router";
// import { useFetchProblems } from "@/entities/learning/model/hooks";
// import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
// import { useMinimumLoadingTime } from "@/widgets/learning-widget/lib/useMinimumLoadingTime";
// import { useEffect, useRef } from "react";
// import {
// 	ConfirmModal,
// 	type ConfirmModalRef,
// } from "@/shared/ui/modal/ConfirmModal";
// import { useQuizStateStore } from "@/features/quiz/model/store";
// import QuizHeader from "@/widgets/learning-widget/QuizHeader";
// import LessonProgressBar from "@/widgets/learning-widget/LessonProgressBar";
// import {
// 	ReportModal,
// 	type ReportType,
// } from "@/features/quiz/submit-report/ui/ReportModal";
// import QuestionContent from "@/entities/learning/ui/QuestionContent";
// import QuizAnswer from "@/widgets/learning-widget/QuizAnswer";
// import QuizReview from "@/widgets/learning-widget/QuizReview";
// import QuizResultWidget from "@/widgets/learning-widget/QuizResultWidget";
// import ReportButton from "@/features/quiz/submit-report/ui/ReportButton";
// import { useSubmitReport } from "@/features/learning/api/use-submit-report";
// import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";

// export const Route = createFileRoute(
// 	"/_authenticated/_blank-layout/temp/learning/$chapterId/$unitId/$lessonId",
// )({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	const { lessonId, chapterId, unitId } = useParams({
// 		from: "/_authenticated/_blank-layout/learning/$chapterId/$unitId/$lessonId",
// 	});
// 	const { data, isPending } = useFetchProblems(Number(lessonId));

// 	const quitModalRef = useRef<ConfirmModalRef>(null);
// 	const reportModalRef = useRef<ConfirmModalRef>(null);
// 	const navigate = useNavigate();

// 	const userAnswers = useQuizStateStore((state) => state.userAnswers);
// 	const currentProblemIndex = useQuizStateStore(
// 		(state) => state.currentProblemIndex,
// 	)
// 	const resetQuiz = useQuizStateStore((state) => state.resetQuiz);
// 	const isQuizCompleted = useQuizStateStore((state) => state.isQuizCompleted);
// 	const pauseTime = useQuizStateStore((state) => state.pauseTime);
// 	const resumeTime = useQuizStateStore((state) => state.resumeTime);
// 	const resetTime = useQuizStateStore((state) => state.resetTime);

// 	const { mutate } = useSubmitReport();

// 	useEffect(() => {
// 		resetQuiz();
// 	}, [resetQuiz]);

// 	const shouldShowLoading = useMinimumLoadingTime({
// 		isLoading: isPending,
// 		minimumTime: 2000,
// 	});

// 	if (shouldShowLoading) {
// 		return (
// 			<main className="flex-grow w-full h-full flex flex-col items-center justify-start mt-10">
// 				<LoadingWidget />
// 			</main>
// 		)
// 	}

// 	if (!data) {
// 		return <div>문제가 발생했습니다.</div>;
// 	}

// 	const { problems, totalProblems } = data;
// 	const isSubmitted = userAnswers.length !== currentProblemIndex;
// 	const activeQuestionIndex = userAnswers.length;
// 	const percent = (userAnswers.length / problems.length) * 100;

// 	const handleClickQuit = () => {
// 		if (quitModalRef) {
// 			quitModalRef.current?.open();
// 			pauseTime();
// 		}
// 	}

// 	const handleClickReport = () => {
// 		if (reportModalRef) {
// 			reportModalRef.current?.open();
// 			pauseTime();
// 		}
// 	}

// 	return (
// 		<QuizStoreProvider mode={"LESSON"} strategy={"BATCH"}>
// 			{!isQuizCompleted && (
// 				<>
// 					<QuizHeader
// 						lessonName={data.unitSummary.title}
// 						onHandleQuit={handleClickQuit}
// 					/>
// 					<LessonProgressBar progress={`${percent}%`} />
// 					<main className="flex-grow bg-gray-200 pt-6 px-10 lg:px-[126px] flex justify-center">
// 						<ConfirmModal
// 							ref={quitModalRef}
// 							title={["지금까지 푼 내역이", "모두 사라져요!"]}
// 							description={[
// 								"자료구조 학습 출제가 중단됩니다",
// 								"정말 학습을 그만두시나요?",
// 							]}
// 							confirmText="그만두기"
// 							cancelText="계속하기"
// 							onConfirm={() => {
// 								resetQuiz()
// 								resetTime()
// 								navigate({
// 									to: "/learning/$chapterId/$unitId",
// 									params: { chapterId, unitId },
// 								})
// 							}}
// 							onCancel={() => {
// 								resumeTime()
// 								console.log("닫힘!")
// 							}}
// 						/>
// 						<ReportModal
// 							ref={reportModalRef}
// 							onSubmit={async (reportType: ReportType, content: string) => {
// 								const trimmedContent = content.trim() === "" ? "-" : content;
// 								mutate({
// 									reportType,
// 									content: trimmedContent,
// 									problemId: problems[currentProblemIndex].problemId,
// 								})
// 							}}
// 							onCancel={() => resumeTime()}
// 						/>

// 						<div
// 							className="relative max-w-[1188px] w-full h-full flex flex-col gap-15"
// 							key={problems[currentProblemIndex].problemId}
// 						>
// 							<ReportButton
// 								className={"absolute right-0 top-0 cursor-pointer"}
// 								onHandleClickReport={handleClickReport}
// 							/>
// 							<div className="w-full">
// 								<QuestionContent
// 									problemId={problems[currentProblemIndex].problemId}
// 									isBookmarked={problems[currentProblemIndex].isBookmarked}
// 									totalProblemsCount={totalProblems}
// 									content={problems[currentProblemIndex].content}
// 									question={problems[currentProblemIndex].question}
// 								/>
// 							</div>
// 							{!isSubmitted && (
// 								<QuizAnswer
// 									problemId={problems[currentProblemIndex].problemId}
// 									problemType={
// 										problems[currentProblemIndex].problemType as
// 											| "SUBJECTIVE"
// 											| "OBJECTIVE"
// 									}
// 									options={problems[currentProblemIndex].options}
// 									answers={problems[currentProblemIndex].answer.content}
// 								/>
// 							)}
// 							{isSubmitted && (
// 								<QuizReview
// 									isLastQuestion={activeQuestionIndex === problems.length}
// 									answer={problems[currentProblemIndex].answer.content}
// 									options={problems[currentProblemIndex].options}
// 									userAnswer={userAnswers[userAnswers.length - 1]}
// 								/>
// 							)}
// 						</div>
// 					</main>
// 				</>
// 			)}
// 			{isQuizCompleted && <QuizResultWidget lessonId={lessonId} />}
// 		</QuizStoreProvider>
// 	)
// }
