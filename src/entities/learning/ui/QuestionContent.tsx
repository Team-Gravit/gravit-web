import { useQuizStateStore } from "@/features/quiz/model/store";
import ClipBoardIcon from "./clipboard.svg?react";
import BookmarkIcon from "@/shared/assets/icons/ic-bookmark-empty.svg?react";
import { cn } from "@/shared/lib/cn";
import useToggleBookmark from "@/features/learning/api/use-toggle-bookmark";
import { useParams } from "@tanstack/react-router";

export default function QuestionContent({
	problemId,
	content,
	question,
	totalProblemsCount,
	isBookmarked,
}: {
	problemId: number;
	content: string;
	question: string;
	totalProblemsCount: number;
	isBookmarked: boolean;
}) {
	const { currentProblemIndex } = useQuizStateStore();
	const { mutate: onToggleBookmark } = useToggleBookmark();
	const { lessonId } = useParams({
		from: "/_authenticated/_blank-layout/learning/$chapterId/$unitId/$lessonId",
	});

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="w-full flex items-center justify-between">
				<h2 className="inline-flex items-center text-black font-semibold text-[32px] ">
					<ClipBoardIcon />
					{currentProblemIndex + 1}/{totalProblemsCount}
				</h2>
				<p>
					<button
						type="button"
						className={cn(
							"cursor-pointer w-5",
							isBookmarked ? "text-3" : "text-transparent",
						)}
						onClick={() =>
							onToggleBookmark({
								problemId: problemId,
								lessonId: Number(lessonId),
								currentIsBookmarked: isBookmarked,
							})
						}
					>
						<BookmarkIcon />
					</button>
					<div className="w-20"></div>
					{/* <ReportButton
						className={"absolute right-0 top-0 cursor-pointer"}
						onHandleClickReport={handleClickReport}
					/> */}
				</p>
			</div>

			<p className="text-gray-900 font-semibold text-2xl">{question}</p>

			<article className="p-4 bg-white rounded-2xl border border-gray-300">
				{content}
			</article>
		</div>
	);
}
