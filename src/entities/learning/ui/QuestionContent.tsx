import { useQuizStateStore } from "@/features/quiz/model/store";
import ClipBoardIcon from "./clipboard.svg?react";

export default function QuestionContent({
	content,
	question,
	totalProblemsCount,
}: {
	content: string;
	question: string;
	totalProblemsCount: number;
}) {
	const { currentProblemIndex } = useQuizStateStore();

	return (
		<div className="w-full flex flex-col gap-4">
			<h2 className="inline-flex items-center text-black font-semibold text-[32px] ">
				<ClipBoardIcon />
				{currentProblemIndex + 1}/{totalProblemsCount}
			</h2>
			<p className="text-gray-900 font-semibold text-2xl">{question}</p>

			<article className="p-4 bg-white rounded-2xl border border-gray-300">
				{content}
			</article>
		</div>
	);
}
