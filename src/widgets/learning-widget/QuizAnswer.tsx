import type { Option } from "@/entities/learning/model/types";
import ObjectiveSolver from "@/features/quiz/answer-submission/ui/ObjectiveSolver";
import SubjectiveSolver from "@/features/quiz/answer-submission/ui/SubjectiveSolver";

export default function QuizAnswer({
	problemId,
	problemType,
	options,
	answers,
}: {
	problemId: number;
	problemType: "SUBJECTIVE" | "OBJECTIVE";
	options: Option[];
	answers: string[];
}) {
	if (problemType === "SUBJECTIVE") {
		console.log("주관식", problemType);

		return <SubjectiveSolver problemId={problemId} answers={answers} />;
	}

	if (problemType === "OBJECTIVE") {
		console.log("객관식", problemType);

		return <ObjectiveSolver options={options} />;
	}
}
