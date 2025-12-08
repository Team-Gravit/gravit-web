import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { ProblemSubmissionRequest } from "@/shared/api/@generated";
import { toast } from "@/shared/lib/toast";

export const useRemoveIncorrectProblem = () => {
	return useMutation({
		mutationFn: async (problemId: number) => {
			const response = await api.learning.deleteWrongAnsweredNote({
				problemId,
			});
			return response.data;
		},
		onSuccess: () => {
			toast.confirm("오답노트에서 제거하였습니다.");
		},
		onError: () => {
			toast.error("오답노트에서 제거하지 못했습니다.");
		},
	});
};

export const useSubmitProblemResult = () => {
	return useMutation({
		mutationFn: async (request: ProblemSubmissionRequest) => {
			const response = await api.learning.saveProblemSubmission(request);
			return response.data;
		},
	});
};
