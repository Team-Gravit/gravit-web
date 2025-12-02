import type { Problem } from "@/entities/learning/model/types";
import ObjectiveReviewer from "@/features/quiz/answer-review/ui/ObjectiveReviewer";
import SubjectiveReviewer from "@/features/quiz/answer-review/ui/SubjectiveReviewer";
import type { UserAnswer } from "@/features/quiz/model/types";

interface ReviewPhaseProps {
	problem: Problem; // 정답, 보기, 문제 유형 등 모든 문제 정보 포함
	userAnswer: UserAnswer; // 사용자가 고른 답안 정보
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
