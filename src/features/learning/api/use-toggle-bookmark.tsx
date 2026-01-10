import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LessonResponse } from "@/shared/api/@generated";
import { toast } from "@/shared/lib/toast";

interface UseToggleBookmarkParams {
	problemId: number;
	currentIsBookmarked: boolean;
	queryKey: readonly (string | number)[];
}

export default function useToggleBookmark() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			problemId,
			currentIsBookmarked,
		}: UseToggleBookmarkParams) => {
			if (currentIsBookmarked) {
				await api.private.learning.deleteBookmark({ problemId });
				return { action: "delete" as const };
			} else {
				await api.private.learning.saveBookmark({ problemId });
				return { action: "save" as const };
			}
		},

		onMutate: async ({ problemId, currentIsBookmarked, queryKey }) => {
			await queryClient.cancelQueries({ queryKey });

			// 이전 데이터 백업
			const previousData = queryClient.getQueryData<LessonResponse>(queryKey);

			// 낙관적 업데이트
			queryClient.setQueryData<LessonResponse>(queryKey, (old) => {
				if (!old) return old;

				return {
					...old,
					problems: old.problems.map((problem) =>
						problem.problemId === problemId
							? { ...problem, isBookmarked: !currentIsBookmarked }
							: problem,
					),
				};
			});

			// 롤백용 컨텍스트 반환
			return { previousData, queryKey };
		},

		// 에러 시 롤백
		onError: (err, _params, context) => {
			console.error("북마크 토글 실패:", err);

			// 이전 데이터로 복구
			if (context?.previousData && context?.queryKey) {
				queryClient.setQueryData(context.queryKey, context.previousData);
			}

			toast.error("북마크 수정에 실패했습니다.");
		},

		// 성공 시
		onSuccess: (result) => {
			const message =
				result.action === "save"
					? "북마크에 추가되었어요."
					: "북마크에서 제거되었어요.";
			toast.confirm(message);
		},
	});
}
