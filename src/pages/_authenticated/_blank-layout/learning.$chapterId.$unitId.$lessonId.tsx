// import QuizHeader from "@/widgets/learning-widget/QuizHeader";
// import LessonProgressBar from "@/widgets/learning-widget/LessonProgressBar";
import LoadingWidget from "@/widgets/learning-widget/LoadingWidget";
import { createFileRoute } from "@tanstack/react-router";
// import { ConfirmModal } from "@/shared/ui/modal/ConfirmModal";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/$lessonId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const isPending = true;

	if (isPending) {
		return (
			<main className="flex-grow w-full h-full flex flex-col items-center justify-start mt-10">
				<LoadingWidget />
			</main>
		);
	}
	return (
		<>
			{/* {!isQuizCompleted && (
				<>
					<QuizHeader lessonName={"임시 이름"} onHandleQuit={handleClickQuit} />
					<LessonProgressBar progress={`${10}%`} />
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
			)} */}
		</>
	);
}
