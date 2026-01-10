import { useMutation, useQueryClient } from "@tanstack/react-query";
import { learningKeys } from "@/entities/learning/api/query-keys";
import { api } from "@/shared/api";
import type {
	LearningSubmissionSaveRequest,
	ProblemSubmissionRequest,
} from "@/shared/api/@generated";

export const useSubmitQuizResult = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (request: LearningSubmissionSaveRequest) => {
			const response =
				await api.private.learning.saveLearningSubmission(request);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: learningKeys.all,
			});
		},
		onError: () => {},
	});
};

export const useSubmitProblemResult = () => {
	return useMutation({
		mutationFn: async (request: ProblemSubmissionRequest) => {
			const response =
				await api.private.learning.saveProblemSubmission(request);
			return response.data;
		},
	});
};
