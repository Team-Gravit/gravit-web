import { useState } from "react";
import { useRemoveIncorrectProblem } from "../../api/use-remove-incorrect-problem";
import { cn } from "@/shared/lib/cn";
import { useQuizSessionState } from "../../model/quiz-session-store";

export default function RemoveFromIncorrectListBtn({
	problemId,
}: {
	problemId: number;
}) {
	const [isRemoved, setIsRemoved] = useState(false);
	const unitId = useQuizSessionState((state) => state.unitId);
	const { mutate: removeIncorrectProblem, isPending } =
		useRemoveIncorrectProblem({ unitId: unitId || 0 });

	return (
		<button
			type="button"
			className={cn(
				"text-gray-500 font-semibold text-2xl underline cursor-pointer hover:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 self-start",
				isRemoved && "hidden",
			)}
			disabled={isPending}
			onClick={() => {
				removeIncorrectProblem(problemId, {
					onSuccess: () => {
						setIsRemoved(true);
					},
				});
			}}
		>
			{isPending ? "" : "오답노트에서 제외하기"}
		</button>
	);
}
