import { useMutation, useQueryClient } from "@tanstack/react-query";
import { learningKeys } from "@/entities/learning/api/query-keys";
import { api } from "@/shared/api";
import type { LessonResponse } from "@/shared/api/@generated";

interface UseToggleBookmarkParams {
	lessonId: number;
	problemId: number;
	currentIsBookmarked: boolean;
}

export default function useToggleBookmark() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			problemId,
			currentIsBookmarked,
		}: UseToggleBookmarkParams) => {
			if (currentIsBookmarked) {
				await api.learning.deleteBookmark({ problemId });
				return { action: "delete" as const };
			} else {
				await api.learning.saveBookmark({ problemId });
				return { action: "save" as const };
			}
		},

		onMutate: async ({ lessonId, problemId, currentIsBookmarked }) => {
			await queryClient.cancelQueries({
				queryKey: learningKeys.lessonProblems(lessonId),
			});

			// 이전 데이터 백업
			const previousData = queryClient.getQueryData<LessonResponse>(
				learningKeys.lessonProblems(lessonId),
			);

			// 낙관적 업데이트
			queryClient.setQueryData<LessonResponse>(
				learningKeys.lessonProblems(lessonId),
				(old) => {
					if (!old) return old;

					return {
						...old,
						problems: old.problems.map((problem) =>
							problem.problemId === problemId
								? { ...problem, isBookmarked: !currentIsBookmarked }
								: problem,
						),
					};
				},
			);

			// 롤백용 컨텍스트 반환
			return { previousData };
		},

		// 에러 시 롤백
		onError: (err, { currentIsBookmarked }, context) => {
			console.error("북마크 토글 실패:", err);

			// 이전 데이터로 복구
			if (context?.previousData?.unitSummary.unitId) {
				queryClient.setQueryData(
					learningKeys.lessonProblems(context.previousData.unitSummary.unitId),
					context.previousData,
				);
			}

			// TODO: 토스트 메시지
			const action = currentIsBookmarked ? "제거" : "추가";
			alert(`북마크 ${action}에 실패했습니다.`);
		},

		// 성공 시
		onSuccess: (result) => {
			// TODO: 토스트 메시지
			const message =
				result.action === "save"
					? "북마크에 추가되었어요."
					: "북마크에서 제거되었어요.";
			alert(message);
		},

		// onSettled: (_, __, { lessonId }) => {
		// 	queryClient.invalidateQueries({
		// 		queryKey: learningKeys.lessonProblems(lessonId),
		// 	});
		// },
	});
}
