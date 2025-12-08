import { useState } from "react";
import ObjectiveOptionItem from "./ObjectiveOptionItem";
import type { Option } from "@/entities/learning/model/types";
import { useQuizSessionState } from "../../model/quiz-session-store";
import { useQuizContext } from "../../model/use-quiz-context";
import { api } from "@/shared/api";

export default function ObjectiveSolver({ options }: { options: Option[] }) {
	const saveUserAnswer = useQuizSessionState((state) => state.saveUserAnswer);
	const submitResults = useQuizSessionState((state) => state.submitResults);

	const { strategy } = useQuizContext();

	// 옵션 활성화 여부를 저장하는 상태
	const [optionActiveStates, setOptionActiveStates] = useState<boolean[]>(
		Array.from({ length: options.length }, () => true),
	);

	const onHandleSelectOption = async (optionIdx: number) => {
		const selectedOption = options[optionIdx];

		// 1. 프론트엔드 상태에 저장
		saveUserAnswer(
			optionIdx,
			selectedOption.isAnswer,
			selectedOption.problemId,
			"OBJECTIVE",
		);

		// 2. STREAM 모드면 즉시 서버 전송
		if (strategy === "STREAM") {
			submitResults(async () => {
				await api.learning.saveProblemSubmission({
					problemId: selectedOption.problemId,
					isCorrect: selectedOption.isAnswer,
				});
			});
		}
	};

	return (
		<section className="flex flex-col w-full">
			<ol className="flex flex-col">
				{options.map((option, idx) => (
					<li key={option.optionId}>
						<ObjectiveOptionItem
							optionNumber={idx + 1}
							option={option}
							isActive={optionActiveStates[idx]}
							onToggleOption={() =>
								setOptionActiveStates((prev) =>
									prev.map((active, i) => (i === idx ? !active : active)),
								)
							}
							onHandleSubmit={onHandleSelectOption}
						/>
					</li>
				))}
			</ol>
		</section>
	);
}
