import type { Option } from "@/entities/learning/model/types";
import type { UserAnswer } from "../../model/types";
import ObjectiveReviewerItem from "./ObjectiveReviewerItem";

export default function ObjectiveReviewer({
	userAnswer,
	options,
}: {
	userAnswer: UserAnswer;
	options: Option[];
}) {
	return (
		<div className="w-full">
			<ol>
				{options.map((option, idx) => {
					return (
						<li key={option.optionId}>
							<ObjectiveReviewerItem
								optionNumber={idx + 1}
								option={option}
								isSelected={userAnswer.userInput === idx}
							/>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
