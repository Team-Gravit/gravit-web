import { useMutation, useQueryClient } from "@tanstack/react-query";
import { learningKeys } from "@/entities/learning/api/query-keys";
import { api, type LessonResponse } from "@/shared/api";
import type { ProblemSubmissionRequest } from "@/shared/api/@generated";
import { toast } from "@/shared/lib/toast";

interface UseRemoveIncorrectProblemParams {
	unitId: number;
}

export const useRemoveIncorrectProblem = ({
	unitId,
}: UseRemoveIncorrectProblemParams) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (problemId: number) => {
			const response =
				await api.private.wrongAnsweredNote.deleteWrongAnsweredProblem({
					problemId,
				});
			return response.data;
		},

		onMutate: async (problemId) => {
			const queryKey = learningKeys.unitWrongAnswers(unitId);
			await queryClient.cancelQueries({ queryKey });

			// 이전 데이터 백업
			const previousData = queryClient.getQueryData<LessonResponse>(queryKey);

			// 낙관적 업데이트: 문제를 배열에서 제거하지 않고 플래그만 추가
			queryClient.setQueryData<LessonResponse>(queryKey, (old) => {
				if (!old || !old.problems) return old;

				return {
					...old,
					problems: old.problems.map((problem) =>
						problem.problemId === problemId
							? { ...problem, isRemovedFromIncorrect: true }
							: problem,
					),
				};
			});

			return { previousData, queryKey };
		},

		onError: (err, _problemId, context) => {
			console.error("오답노트 제거 실패:", err);

			// 에러 시 롤백
			if (context?.previousData && context?.queryKey) {
				queryClient.setQueryData(context.queryKey, context.previousData);
			}

			toast.error("오답노트에서 제거하지 못했습니다.");
		},

		onSuccess: () => {
			toast.confirm("오답노트에서 제거하였습니다.");
		},
	});
};

export const useSubmitProblemResult = () => {
	return useMutation({
		mutationFn: async (request: ProblemSubmissionRequest) => {
			const response = await api.private.problem.saveProblemSubmission(request);
			return response.data;
		},
	});
};
