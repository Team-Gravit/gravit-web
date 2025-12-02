import type { Problem } from "../model/types";
import ProblemHeader from "./ProblemHeader";

export default function ProblemStatement({
	problem,
	totalProblemsCount,
}: {
	problem: Problem;
	totalProblemsCount: number;
}) {
	const { content, question } = problem;

	return (
		<section className="w-full flex flex-col gap-4">
			<ProblemHeader
				totalProblemsCount={totalProblemsCount}
				problem={problem}
			/>

			<p className="text-gray-900 font-semibold text-2xl break-keep">
				{question}
			</p>

			<article className="p-6 bg-white rounded-2xl text-2xl border font-medium border-gray-300 break-keep">
				{content}
			</article>
		</section>
	);
}
