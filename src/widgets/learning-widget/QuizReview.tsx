import type { Option } from "@/entities/learning/model/types";
import ObjectiveReviewer from "@/features/quiz/answer-review/ui/ObjectiveReviewer";
import SubjectiveReviewer from "@/features/quiz/answer-review/ui/SubjectiveReviewer";
import FloatingButton from "@/features/quiz/answer-submission/ui/FloatingButton";
import { useQuizStateStore } from "@/features/quiz/model/store";
import type { UserAnswer } from "@/features/quiz/model/types";
import NextIcon from "./assets/floating-next.svg?react";
import { useEffect, useRef } from "react";
import { useSubmitQuizResult } from "@/features/quiz/model/useSubmitQuizResult";
import { useNavigate } from "@tanstack/react-router";

export default function QuizReview({
	lessonId,
	answer,
	userAnswer,
	options,
	isLastQuestion,
}: {
	lessonId: number;
	answer: string[];
	userAnswer: UserAnswer;
	options: Option[];
	isLastQuestion: boolean;
}) {
	const { mutate: submitResult } = useSubmitQuizResult();

	const goToNextProblem = useQuizStateStore((state) => state.goToNextProblem);
	const completeQuiz = useQuizStateStore((state) => state.completeQuiz);
	const pauseTime = useQuizStateStore((state) => state.pauseTime);
	const userAnswers = useQuizStateStore((state) => state.userAnswers);
	const timeElapsed = useQuizStateStore((state) => state.timeElapsed);
	const saveQuizResult = useQuizStateStore((state) => state.saveQuizResult);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const navigate = useNavigate();

	if (isLastQuestion) {
		pauseTime();
	}

	useEffect(() => {
		const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Enter") {
				buttonRef.current?.click();
			}
		};

		document.addEventListener("keydown", handleGlobalKeyDown);

		return () => {
			document.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, []);

	const handleSubmitQuiz = () => {
		const accuracy = Math.round(
			(userAnswers.filter((answer) => answer.isCorrect).length /
				userAnswers.length) *
				100,
		);

		submitResult(
			{
				lessonId,
				learningTime: timeElapsed,
				accuracy,
				problemResults: userAnswers.map((answer) => ({
					problemId: answer.problemId,
					isCorrect: answer.isCorrect,
					incorrectCounts: 1,
				})),
			},
			{
				onSuccess: (resultData) => {
					completeQuiz();
					saveQuizResult({ ...resultData, accuracy });
					navigate({
						to: "/lesson/result",
						replace: true,
					});
				},
			},
		);
	};

	return (
		<>
			<div className="w-full">
				{userAnswer.problemType === "SUBJECTIVE" && (
					<SubjectiveReviewer userAnswer={userAnswer} answer={answer} />
				)}
				{userAnswer.problemType === "OBJECTIVE" && (
					<ObjectiveReviewer userAnswer={userAnswer} options={options} />
				)}
			</div>
			<FloatingButton
				ref={buttonRef}
				onHandleClick={isLastQuestion ? handleSubmitQuiz : goToNextProblem}
			>
				<NextIcon className="w-[20px]" />
			</FloatingButton>
		</>
	);
}
