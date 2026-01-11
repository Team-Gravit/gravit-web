import { useEffect, useRef, useState } from "react";
import CheckIcon from "@/shared/assets/icons/check.svg?react";
import NextIcon from "./../../assets/floating-next.svg?react";
import type { Problem } from "@/entities/learning/model/types";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import { api } from "@/shared/api";
import { useRouter } from "@tanstack/react-router";
import { learningKeys } from "@/entities/learning/api/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import AnswerPhase, { type AnswerPhaseHandle } from "../../AnswerPhase";
import IncorrectReviewPhase from "./IncorrectReviewPahse";

interface AnswerInteractionProps {
	problem: Problem;
	totalProblemsCount: number;
	unitId: number;
}

export default function IncorrectInteraction({
	problem,
	totalProblemsCount,
	unitId,
}: AnswerInteractionProps) {
	const userAnswers = useQuizSessionState((state) => state.userAnswers);
	const saveUserAnswer = useQuizSessionState((state) => state.saveUserAnswer);
	const goToNextProblem = useQuizSessionState((state) => state.goToNextProblem);
	const completeQuiz = useQuizSessionState((state) => state.completeQuiz);
	const pauseTime = useQuizSessionState((state) => state.pauseTime);
	const submitResults = useQuizSessionState((state) => state.submitResults);

	const currentProblemIndex = useQuizSessionState(
		(state) => state.currentProblemIndex,
	);

	const answerPhaseRef = useRef<AnswerPhaseHandle>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();
	const queryClient = useQueryClient();

	const isSubmitted = userAnswers.length !== currentProblemIndex;
	const activeQuestionIndex = userAnswers.length;
	const isLastQuestion = activeQuestionIndex === totalProblemsCount;

	// 주관식 답 입력 상태 관리 (State 끌어올리기)
	const [enteredAnswer, setEnteredAnswer] = useState("");

	const handleButtonClick = async () => {
		if (!isSubmitted) {
			const answer = answerPhaseRef.current?.getAnswer();

			// 주관식 답이 있는 경우
			if (answer) {
				saveUserAnswer(
					answer.answer,
					answer.isCorrect,
					problem.problemId,
					"SUBJECTIVE",
				);

				submitResults(async () => {
					await api.private.learning.saveProblemSubmission({
						problemId: problem.problemId,
						isCorrect: answer.isCorrect,
					});
				});
			}
			return;
		}

		if (isLastQuestion) {
			pauseTime();

			completeQuiz();

			await queryClient.invalidateQueries({
				queryKey: learningKeys.unitLessons(unitId),
			});

			await queryClient.invalidateQueries({
				queryKey: learningKeys.unitWrongAnswers(unitId),
			});
			router.history.back();
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
					ref={answerPhaseRef}
					problem={problem}
					enteredAnswer={enteredAnswer}
					setEnteredAnswer={setEnteredAnswer}
				/>
			) : (
				<IncorrectReviewPhase
					problem={problem}
					userAnswer={userAnswers[currentProblemIndex]}
				/>
			)}
			{(isSubmitted || problem.problemType === "SUBJECTIVE") && (
				<button
					ref={buttonRef}
					type="button"
					disabled={
						!isSubmitted &&
						problem.problemType === "SUBJECTIVE" &&
						enteredAnswer.trim().length === 0
					}
					onClick={handleButtonClick}
					className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] bg-main-gr rounded-full absolute bottom-0 right-0 lg:bottom-0 lg:right-0 -translate-y-12 hover:bg-main-gr-dark transition-colors"
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
