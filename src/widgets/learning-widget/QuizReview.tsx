import type { Option } from "@/entities/learning/model/types";
import ObjectiveReviewer from "@/features/quiz/answer-review/ui/ObjectiveReviewer";
import SubjectiveReviewer from "@/features/quiz/answer-review/ui/SubjectiveReviewer";
import FloatingButton from "@/features/quiz/answer-submission/ui/FloatingButton";
import { useQuizStateStore } from "@/features/quiz/model/store";
import type { UserAnswer } from "@/features/quiz/model/types";
import NextIcon from "./assets/floating-next.svg?react";
import { useEffect, useRef } from "react";

export default function QuizReview({
	answer,
	userAnswer,
	options,
	isLastQuestion,
}: {
	answer: string[];
	userAnswer: UserAnswer;
	options: Option[];
	isLastQuestion: boolean;
}) {
	const goToNextProblem = useQuizStateStore((state) => state.goToNextProblem);
	const completeQuiz = useQuizStateStore((state) => state.completeQuiz);
	const pauseTime = useQuizStateStore((state) => state.pauseTime);

	const buttonRef = useRef<HTMLButtonElement>(null);

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
				onHandleClick={isLastQuestion ? completeQuiz : goToNextProblem}
			>
				<NextIcon className="w-[20px] mobile:w-[64px]" />
			</FloatingButton>
		</>
	);
}
