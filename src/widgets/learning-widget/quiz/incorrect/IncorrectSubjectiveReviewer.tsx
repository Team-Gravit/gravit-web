import { cn } from "@/shared/lib/cn";
import type { Answer } from "@/entities/learning/model/types";
import type { UserAnswer } from "@/features/quiz/model/types";
import RemoveFromIncorrectListBtn from "@/features/quiz/answer-review/ui/RemoveFromMistakeListBtn";

export default function IncorrectSubjectiveReviewer({
	userAnswer,
	answer,
}: {
	userAnswer: UserAnswer;
	answer: Answer;
}) {
	return (
		<div className="w-full flex flex-col items-center gap-8">
			<div
				className={cn(
					"w-full flex items-center h-[68px] px-8 py-4 bg-white rounded-lg border text-2xl font-medium focus:outline-none focus:border-gray-400 ",
					userAnswer.isCorrect
						? "border-[#00A80B] text-[#00A80B]"
						: "border-error text-error",
				)}
			>
				{userAnswer.userInput}
			</div>

			{!userAnswer.isCorrect ? (
				<p className="w-full flex flex-col gap-4">
					<small className=" text-error-info text-2xl font-semibold">
						정답: {answer.content.join(", ")}
					</small>
					<span className="text-error-info text-2xl">{answer.explanation}</span>
				</p>
			) : null}
			{userAnswer.isCorrect ? (
				<div className="w-full flex items-center justify-between">
					<small className="self-start text-[#00A80B] font-semibold text-2xl">
						정답입니다!
					</small>

					<RemoveFromIncorrectListBtn problemId={userAnswer.problemId} />
				</div>
			) : null}
		</div>
	);
}
