import { forwardRef, useRef, useImperativeHandle } from "react";
import type { Problem } from "@/entities/learning/model/types";
import ObjectiveSolver from "@/features/quiz/answer-submission/ui/ObjectiveSolver";
import SubjectiveSolver, {
	type SubjectiveSolverHandle,
} from "@/features/quiz/answer-submission/ui/SubjectiveSolver";

export interface AnswerPhaseHandle {
	getAnswer: () => {
		answer: string;
		isCorrect: boolean;
	} | null;
	hasAnswer: () => boolean;
}

export default forwardRef<
	AnswerPhaseHandle,
	{
		problem: Problem;
		enteredAnswer?: string;
		setEnteredAnswer?: (value: string) => void;
	}
>(function AnswerPhase({ problem, enteredAnswer, setEnteredAnswer }, ref) {
	const { problemType, answer, options } = problem;
	const subjectiveSolverRef = useRef<SubjectiveSolverHandle>(null);

	// 부모 컴포넌트가 답을 꺼낼 수 있도록 ref 노출
	useImperativeHandle(ref, () => ({
		getAnswer: () => {
			// 주관식: subjectiveSolverRef에서 답 가져오기
			if (problemType === "SUBJECTIVE" && subjectiveSolverRef.current) {
				return subjectiveSolverRef.current.getAnswer();
			}
			// 객관식: null 반환 (이 경우는 사용되지 않음)
			return null;
		},
		hasAnswer: () => {
			// 주관식: 답이 입력되었는지 확인
			if (problemType === "SUBJECTIVE" && subjectiveSolverRef.current) {
				return subjectiveSolverRef.current.hasAnswer();
			}
			// 객관식: 항상 true (별도 체크 없음)
			return true;
		},
	}));

	if (problemType === "SUBJECTIVE") {
		return (
			<SubjectiveSolver
				ref={subjectiveSolverRef}
				answers={answer.content}
				enteredAnswer={enteredAnswer}
				setEnteredAnswer={setEnteredAnswer}
			/>
		);
	}

		if (problemType === "OBJECTIVE") {
			return <ObjectiveSolver options={options} />;
		}

		return null;
	},
);
