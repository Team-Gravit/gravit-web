import type { Option } from "@/entities/learning/model/types";
import { cn } from "@/shared/lib/cn";
import XIcon from "@/shared/assets/icons/x-light.svg?react";
import CheckIcon from "@/shared/assets/icons/check-light.svg?react";
import RemoveFromIncorrectListBtn from "@/features/quiz/answer-review/ui/RemoveFromMistakeListBtn";

export default function IncorrectObjectiveReviewerItem({
	option,
	optionNumber,
	isSelected,
}: {
	option: Option;
	optionNumber: number;
	isSelected: boolean;
}) {
	const isAnswer = option.isAnswer;

	const checkState = (): "WRONG" | "CORRECT" | "NORMAL" => {
		if (isSelected && !isAnswer) {
			return "WRONG";
		} else if (isAnswer) {
			return "CORRECT";
		}
		return "NORMAL";
	};

	const optionState = checkState();

	return (
		<div
			className={cn(
				"flex justify-between w-full px-5 py-4 gap-4",
				optionState === "WRONG" && "bg-gray-300",
			)}
		>
			<span
				className={cn(
					"inline-flex items-center justify-center rounded-full bg-white border border-[#6D6D6D] text-[#6D6D6D] w-10 h-10 font-bold",
					optionState === "CORRECT" && "bg-correct",
					optionState === "WRONG" && "bg-error",
				)}
			>
				{optionState === "NORMAL" && optionNumber}
				{optionState === "WRONG" && <XIcon />}
				{optionState === "CORRECT" && <CheckIcon />}
			</span>

			{isSelected && isAnswer ? (
				<div className="flex items-center flex-1 justify-between">
					<p
						className={cn(
							" text-2xl font-medium text-correct h-full min-h-10 flex items-center",
						)}
					>
						{option.content}
					</p>
					<RemoveFromIncorrectListBtn problemId={option.problemId} />
				</div>
			) : (
				<dl
					className={cn(
						"flex flex-col flex-1 ",
						optionState === "WRONG" && "gap-2",
					)}
				>
					<dt
						className={cn(
							" text-2xl font-medium text-[#6D6D6D] h-full min-h-10 flex items-center",
							optionState === "CORRECT" && "text-correct",
							optionState === "WRONG" && "text-error-info",
						)}
					>
						{option.content}
					</dt>
					<dd className={"text-error-info text-[20px] font-normal break-keep"}>
						{optionState === "WRONG" && option.explanation}
					</dd>
				</dl>
			)}
		</div>
	);
}
