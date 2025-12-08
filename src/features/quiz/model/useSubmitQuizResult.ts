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
			const response = await api.learning.saveLearningSubmission(request);
			return response.data;
		},
		onSuccess: () => {
			alert("퀴즈 결과 제출 성공:");
			queryClient.invalidateQueries({
				queryKey: learningKeys.all,
			});
		},
		onError: () => {
			alert("퀴즈 결과 제출 실패:");
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
