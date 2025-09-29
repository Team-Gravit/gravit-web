import { cn } from "@/shared/lib/cn";
import type { UserAnswer } from "../../model/types";

export default function SubjectiveReviewer({
	userAnswer,
	answer,
}: {
	userAnswer: UserAnswer;
	answer: string[];
}) {
	return (
		<div className="w-full max-w-[1188px] flex flex-col items-center gap-8">
			<input
				disabled={true}
				value={userAnswer.userInput}
				className={cn(
					"w-full h-[73px] bg-white rounded-lg border border-gray-200 pl-6 text-gray-600 text-2xl font-medium focus:outline-none focus:border-gray-400",
					userAnswer.isCorrect && "border-[#00A80B] text-[#00A80B]",
					!userAnswer.isCorrect && "border-error text-error",
				)}
			/>

			{!userAnswer.isCorrect ? (
				<small className="self-start  text-error-info text-[20px] font-semibold">
					정답: {answer.join(", ")}
				</small>
			) : null}
			{userAnswer.isCorrect ? (
				<small className="self-start text-[#00A80B] font-semibold text-[20px]">
					정답입니다!
				</small>
			) : null}
		</div>
	);
}
