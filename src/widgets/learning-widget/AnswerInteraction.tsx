import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { learningKeys } from "@/entities/learning/api/query-keys";
import type { Problem } from "@/entities/learning/model/types";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import { useQuizContext } from "@/features/quiz/model/use-quiz-context";
import { api } from "@/shared/api";
import type { LearningSubmissionSaveRequest } from "@/shared/api/@generated";
import CheckIcon from "@/shared/assets/icons/check.svg?react";
import AnswerPhase, { type AnswerPhaseHandle } from "./AnswerPhase";
import NextIcon from "./assets/floating-next.svg?react";
import ReviewPhase from "./ReviewPhase";

interface AnswerInteractionProps {
	problem: Problem;
	totalProblemsCount: number;
	unitId: number;
}

export default function AnswerInteraction({
	problem,
	totalProblemsCount,
	unitId,
}: AnswerInteractionProps) {
	const userAnswers = useQuizSessionState((state) => state.userAnswers); // 사용자가 응답한 내용들
	const saveUserAnswer = useQuizSessionState((state) => state.saveUserAnswer); // 응답을 프론트 상태에 저장하는 함수
	const goToNextProblem = useQuizSessionState((state) => state.goToNextProblem);
	const completeQuiz = useQuizSessionState((state) => state.completeQuiz);
	const pauseTime = useQuizSessionState((state) => state.pauseTime);
	const submitResults = useQuizSessionState((state) => state.submitResults);
	const saveSubmitResponse = useQuizSessionState(
		(state) => state.saveSubmitResponse,
	);
	const lessonId = useQuizSessionState((state) => state.lessonId);
	const timeElapsed = useQuizSessionState((state) => state.timeElapsed);

	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);

	const { strategy, mode } = useQuizContext();
	const answerPhaseRef = useRef<AnswerPhaseHandle>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();
	const queryClient = useQueryClient();

	const isSubmitted = userAnswers.length !== currentProblemIndex;
	const activeQuestionIndex = userAnswers.length;
	const isLastQuestion = activeQuestionIndex === totalProblemsCount;

	const [enteredAnswer, setEnteredAnswer] = useState("");

	// 문제가 바뀔 때마다 입력값 초기화
	useEffect(() => {
		setEnteredAnswer("");
	}, [problem.problemId]);

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
					submitResults(async () => {
						await api.private.problem.saveProblemSubmission({
							problemId: problem.problemId,
							isCorrect: answer.isCorrect,
						});
					});
				}
			}
			return;
		}

		// 제출 후 상태
		if (isLastQuestion) {
			// 마지막 문제: 결과 제출
			pauseTime();

			// BATCH 모드면 여기서 전체 결과 제출
			if (strategy === "BATCH") {
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

					const response =
						await api.private.lesson.saveLessonSubmission(submitData);

					// API 응답을 store에 저장
					saveSubmitResponse(response.data);
				});

				// 레슨 완료 시 전체 학습 데이터 무효화
				await queryClient.invalidateQueries({
					queryKey: learningKeys.unitLessons(unitId),
				});

				await queryClient.invalidateQueries({
					queryKey: learningKeys.all,
					refetchType: "active",
				});

				// 메인 페이지 데이터 무효화
				await queryClient.invalidateQueries({
					queryKey: ["users", "main-page"],
				});
			}

			completeQuiz();

			if (strategy === "STREAM") {
				await queryClient.invalidateQueries({
					queryKey: learningKeys.unitLessons(unitId),
				});

				if (mode === "BOOKMARK") {
					await queryClient.invalidateQueries({
						queryKey: learningKeys.unitBookmarks(unitId),
					});
				} else if (mode === "INCORRECT") {
					await queryClient.invalidateQueries({
						queryKey: learningKeys.unitWrongAnswers(unitId),
					});
				}

				router.history.back();
			}
		} else {
			goToNextProblem();
		}
	};

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
		<section
			key={problem.problemId}
			className="relative flex flex-col w-full gap-6 flex-grow justify-between"
		>
			{!isSubmitted ? (
				<AnswerPhase
					key={problem.problemId}
					ref={answerPhaseRef}
					problem={problem}
					enteredAnswer={enteredAnswer}
					setEnteredAnswer={setEnteredAnswer}
				/>
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
					disabled={
						!isSubmitted &&
						problem.problemType === "SUBJECTIVE" &&
						enteredAnswer.trim().length === 0
					}
					className="flex items-center justify-center cursor-pointer w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] bg-main-gr rounded-full absolute bottom-0 right-0 lg:bottom-0 lg:right-0 -translate-y-12 hover:bg-main-gr-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
