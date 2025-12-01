import { useState } from "react";
import ObjectiveOptionItem from "./ObjectiveOptionItem";
import { useQuizStateStore } from "../../model/store";
import type { Option } from "@/entities/learning/model/types";

export default function ObjectiveSolver({ options }: { options: Option[] }) {
	const { submitAnswer } = useQuizStateStore();

	// 옵션 활성화 여부를 저장하는 상태
	const [optionActiveStates, setOptionActiveStates] = useState<boolean[]>(
		Array.from({ length: options.length }, () => true),
	);

	const onHandleSelectOption = (optionIdx: number) => {
		submitAnswer(
			optionIdx,
			options[optionIdx].isAnswer,
			options[optionIdx].problemId,
			"OBJECTIVE",
		);
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
