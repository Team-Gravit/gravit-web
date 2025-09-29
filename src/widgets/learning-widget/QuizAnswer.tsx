import type { Option } from "@/entities/learning/model/types";
import ObjectiveSolver from "@/features/quiz/answer-submission/ui/ObjectiveSolver";
import SubjectiveSolver from "@/features/quiz/answer-submission/ui/SubjectiveSolver";

export default function QuizAnswer({
	problemId,
	problemType,
	options,
	answer,
}: {
	problemId: number;
	problemType: "SUBJECTIVE" | "OBJECTIVE";
	options: Option[];
	answer: string;
}) {
	if (problemType === "SUBJECTIVE") {
		console.log("주관식", problemType);

		return (
			<SubjectiveSolver
				problemId={problemId}
				answer={answer.split(",").map((s) => s.trim())}
			/>
		);
	}

	if (problemType === "OBJECTIVE") {
		console.log("객관식", problemType);

		return <ObjectiveSolver options={options} />;
	}
}
