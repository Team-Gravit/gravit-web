import type { Option } from "@/entities/learning/model/types";
import type { UserAnswer } from "@/features/quiz/model/types";
import IncorrectObjectiveReviewerItem from "./IncorrectObjectiveReviewerItem";

export default function IncorrectObjectiveReviewer({
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
							<IncorrectObjectiveReviewerItem
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
