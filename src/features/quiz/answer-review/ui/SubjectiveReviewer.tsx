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
		<div className="w-full flex flex-col items-center gap-8">
			<div
				className={cn(
					"w-full min-h-[68px] px-8 py-4 bg-white rounded-lg border text-2xl font-medium focus:outline-none focus:border-gray-400",
					userAnswer.isCorrect
						? "border-[#00A80B] text-[#00A80B]"
						: "border-error text-error",
				)}
			>
				{userAnswer.userInput}
			</div>

			{/** TODO: 오답 문구 추가해야함 */}
			{!userAnswer.isCorrect ? (
				<p className="w-full flex flex-col gap-4">
					<small className=" text-error-info text-2xl font-semibold">
						정답: {answer.join(", ")}
					</small>
					<span className="text-error-info text-2xl">
						FIFO는 First In, First Out, 즉 먼저 들어간 것이 먼저 나간다는 의미의
						구조입니다. 이는 큐(Queue) 라는 자료구조의 기본 동작 방식이에요.
					</span>
				</p>
			) : null}
			{userAnswer.isCorrect ? (
				<small className="self-start text-[#00A80B] font-semibold text-2xl">
					정답입니다!
				</small>
			) : null}
		</div>
	);
}
