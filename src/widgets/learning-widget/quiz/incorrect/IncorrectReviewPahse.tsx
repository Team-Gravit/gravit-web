import type { Problem } from "@/entities/learning/model/types";
import type { UserAnswer } from "@/features/quiz/model/types";
import IncorrectObjectiveReviewer from "./IncorrectObjectiveReviewer";
import IncorrectSubjectiveReviewer from "./IncorrectSubjectiveReviewer";

interface ReviewPhaseProps {
	problem: Problem;
	userAnswer: UserAnswer;
}

export default function IncorrectReviewPhase({
	problem,
	userAnswer,
}: ReviewPhaseProps) {
	return (
		<div className="w-full">
			{userAnswer.problemType === "SUBJECTIVE" && (
				<IncorrectSubjectiveReviewer
					userAnswer={userAnswer}
					answer={problem.answer}
				/>
			)}
			{userAnswer.problemType === "OBJECTIVE" && (
				<IncorrectObjectiveReviewer
					userAnswer={userAnswer}
					options={problem.options}
				/>
			)}
		</div>
	);
}
