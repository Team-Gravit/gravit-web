import { useRef, useEffect } from "react";
import CheckIcon from "@/shared/assets/icons/check.svg?react";
import NextIcon from "./assets/floating-next.svg?react";
import type { Problem } from "@/entities/learning/model/types";
import { useQuizContext } from "@/features/quiz/model/use-quiz-context";
import AnswerPhase, { type AnswerPhaseHandle } from "./AnswerPhase";
import ReviewPhase from "./ReviewPhase";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import { api } from "@/shared/api";
import type { LearningSubmissionSaveRequest } from "@/shared/api/@generated";

interface AnswerInteractionProps {
	problem: Problem;
	totalProblemsCount: number;
}

export default function AnswerInteraction({
	problem,
	totalProblemsCount,
}: AnswerInteractionProps) {
	const userAnswers = useQuizSessionState((state) => state.userAnswers); // 사용자가 응답한 내용들
	const saveUserAnswer = useQuizSessionState((state) => state.saveUserAnswer); // 응답을 프론트 상태에 저장하는 함수
	const goToNextProblem = useQuizSessionState((state) => state.goToNextProblem);
	const completeQuiz = useQuizSessionState((state) => state.completeQuiz);
	const pauseTime = useQuizSessionState((state) => state.pauseTime);
	const submitResults = useQuizSessionState((state) => state.submitResults);
	const lessonId = useQuizSessionState((state) => state.lessonId);
	const timeElapsed = useQuizSessionState((state) => state.timeElapsed);

	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);

	const { strategy } = useQuizContext();
	const answerPhaseRef = useRef<AnswerPhaseHandle>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const isSubmitted = userAnswers.length !== currentProblemIndex;
	const activeQuestionIndex = userAnswers.length;
	const isLastQuestion = activeQuestionIndex === totalProblemsCount;

	// 한 개 버튼의 핵심 로직
	const handleButtonClick = async () => {
		// 제출되지 않은 경우
		if (!isSubmitted) {
			// 주관식이면 답을 꺼냄
			const answer = answerPhaseRef.current?.getAnswer();

			// 주관식 답이 있는 경우
			if (answer) {
				saveUserAnswer(
					answer.answer,
					answer.isCorrect,
					problem.problemId,
					"SUBJECTIVE",
				);

				// STREAM 모드면 즉시 서버 전송
				if (strategy === "STREAM") {
					// TODO: useSubmitAnswerStream 호출
					console.log(
						"[STREAM] 주관식 답 제출:",
						answer.answer,
						answer.isCorrect,
					);

					submitResults(async () => {
						await api.learning.saveProblemSubmission({
							problemId: problem.problemId,
							isCorrect: answer.isCorrect,
						});
					});
				}
			}
			// 객관식은 이미 자동 제출됨 (여기 도달 X)
			return;
		}

		// 제출 후 상태
		if (isLastQuestion) {
			// 마지막 문제: 결과 제출
			pauseTime();

			// BATCH 모드면 여기서 전체 결과 제출
			if (strategy === "BATCH") {
				// TODO: useSubmitQuizResult 호출
				submitResults(async () => {
					const correctCount = userAnswers.filter(
						(answer) => answer.isCorrect,
					).length;
					const accuracy = Math.round(
						(correctCount / userAnswers.length) * 100,
					);

					const submitData: LearningSubmissionSaveRequest = {
						lessonSubmissionSaveRequest: {
							lessonId: Number(lessonId),
							learningTime: timeElapsed,
							accuracy: accuracy,
						},
						problemSubmissionRequests: userAnswers.map((answer) => ({
							problemId: answer.problemId,
							isCorrect: answer.isCorrect,
						})),
					};

					await api.learning.saveLearningSubmission(submitData);
				});
			}

			completeQuiz();
		} else {
			// 다음 문제로
			goToNextProblem();
		}
	};

	// Enter 키 처리
	useEffect(() => {
		const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Enter" && buttonRef.current) {
				buttonRef.current.click();
			}
		};

		document.addEventListener("keydown", handleGlobalKeyDown);

		return () => {
			document.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, []);

	return (
		<section className="relative flex flex-col w-full gap-6 flex-grow justify-between">
			{!isSubmitted ? (
				<AnswerPhase ref={answerPhaseRef} problem={problem} />
			) : (
				<ReviewPhase
					problem={problem}
					userAnswer={userAnswers[currentProblemIndex]}
				/>
			)}
			{!(!isSubmitted && problem.problemType === "OBJECTIVE") && (
				<button
					ref={buttonRef}
					type="button"
					onClick={handleButtonClick}
					className="flex items-center justify-center cursor-pointer w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] bg-main-gr rounded-full absolute bottom-0 right-0 lg:bottom-0 lg:right-0 -translate-y-12 hover:bg-main-gr-dark transition-colors"
				>
					{!isSubmitted ? (
						<CheckIcon className="w-[45px] lg:w-[74px]" />
					) : (
						<NextIcon className="w-[45px] lg:w-[74px]" />
					)}
				</button>
			)}
		</section>
	);
}
