import useToggleBookmark from "@/features/learning/api/use-toggle-bookmark";
import BookmarkIcon from "@/shared/assets/icons/ic-bookmark-empty.svg?react";
import ClipBoardIcon from "./clipboard.svg?react";
import { cn } from "@/shared/lib/cn";
import ReportButton from "@/features/quiz/submit-report/ui/ReportButton";
import type { Problem } from "../model/types";
import { useQuizSessionState } from "@/features/quiz/model/quiz-session-store";
import { learningKeys } from "../api/query-keys";
import { useReportModalStore } from "@/features/quiz/model/use-report-modal-store";

export default function ProblemHeader({
	totalProblemsCount,
	problem,
}: {
	totalProblemsCount: number;
	problem: Problem;
}) {
	const { openReportModal } = useReportModalStore();

	const { mutate: onToggleBookmark } = useToggleBookmark();
	const currentProblemIndex = useQuizSessionState((s) => s.currentProblemIndex);
	const mode = useQuizSessionState((s) => s.mode);
	const lessonId = useQuizSessionState((s) => s.lessonId);
	const unitId = useQuizSessionState((s) => s.unitId);

	const { problemId, isBookmarked } = problem;

	// Mode에 따라 queryKey 결정
	const getQueryKey = () => {
		switch (mode) {
			case "BOOKMARK":
				return unitId ? learningKeys.unitBookmarks(unitId) : null;
			case "INCORRECT":
				return unitId ? learningKeys.unitWrongAnswers(unitId) : null;
			case "LESSON":
				return lessonId ? learningKeys.lessonProblems(lessonId) : null;
			default:
				return null;
		}
	};

	const queryKey = getQueryKey();

	return (
		<header className="w-full flex items-center justify-between">
			<h2 className="inline-flex items-center text-black font-semibold text-[32px] ">
				<ClipBoardIcon />
				{currentProblemIndex + 1}/{totalProblemsCount}
			</h2>
			<div className="flex items-center gap-4 h-8 w-fit">
				<button
					type="button"
					className={cn(
						"cursor-pointer shrink-0",
						isBookmarked ? "text-3" : "text-transparent",
					)}
					onClick={() =>
						queryKey &&
						onToggleBookmark({
							problemId: problemId,
							currentIsBookmarked: isBookmarked,
							queryKey: queryKey,
						})
					}
				>
					<BookmarkIcon />
				</button>
				<ReportButton
					className={"cursor-pointer shrink-0"}
					onHandleClickReport={openReportModal}
				/>
			</div>
		</header>
	);
}
