import { cn } from "@/shared/lib/cn";
import ClosedEyeIcon from "./assets/closed-eye.svg?react";
import OpenEyeIcon from "./assets/open-eye.svg?react";

export default function ObjectiveOptionItem({
	optionNumber,
	option,
	isActive,
	onToggleOption,
	onHandleSubmit,
}: {
	optionNumber: number;
	option: {
		optionId: number;
		content: string;
		explanation: string;
		isAnswer: boolean;
		problemId: number;
	};
	isActive: boolean;
	onToggleOption: () => void;
	onHandleSubmit: (optionIdx: number) => void;
}) {
	return (
		<div
			className={cn(
				"flex justify-between items-center",
				isActive
					? "cursor-pointer hover:bg-gray-300"
					: "cursor-auto opacity-30 hover:bg-none",
			)}
		>
			<button
				type="button"
				onClick={() => {
					console.log(optionNumber, "클릭됨", isActive);
					return isActive && onHandleSubmit(optionNumber - 1);
				}}
				disabled={!isActive}
				className={cn(
					"flex gap-4 items-center flex-1 text-left pl-5 py-4",
					isActive && "cursor-pointer",
				)}
			>
				<span className="inline-flex items-center justify-center rounded-full bg-white border border-gray-600 text-gray-600 w-10 h-10 font-medium shrink-0">
					{optionNumber}
				</span>
				<span className="text-2xl font-medium text-gray-600">
					{option.content}
				</span>
			</button>

			<button
				type="button"
				onClick={onToggleOption}
				className="cursor-pointer ml-4 mr-4 p-1 shrink-0"
				aria-label={isActive ? "선지 숨기기" : "선지 보이기"}
			>
				{isActive ? <OpenEyeIcon /> : <ClosedEyeIcon />}
			</button>
		</div>
	);
}
