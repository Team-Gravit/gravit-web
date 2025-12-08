import type { Problem } from "@/entities/learning/model/types";
import ObjectiveReviewer from "@/features/quiz/answer-review/ui/ObjectiveReviewer";
import SubjectiveReviewer from "@/features/quiz/answer-review/ui/SubjectiveReviewer";
import type { UserAnswer } from "@/features/quiz/model/types";

interface ReviewPhaseProps {
	problem: Problem;
	userAnswer: UserAnswer;
}

export default function ReviewPhase({ problem, userAnswer }: ReviewPhaseProps) {
	return (
		<div className="w-full">
			{userAnswer.problemType === "SUBJECTIVE" && (
				<SubjectiveReviewer
					userAnswer={userAnswer}
					answer={problem.answer.content}
				/>
			)}
			{userAnswer.problemType === "OBJECTIVE" && (
				<ObjectiveReviewer userAnswer={userAnswer} options={problem.options} />
			)}
		</div>
	);
}
