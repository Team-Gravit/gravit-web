import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { LearningSubmissionSaveRequest } from "@/shared/api/@generated";
import { learningKeys } from "../api/query-keys";

export const useSubmitLessonResult = () => {
	const queryClient = useQueryClient();
	const query = useMutation({
		mutationFn: async (lessonResult: LearningSubmissionSaveRequest) => {
			const response = await api.learning.saveLearningSubmission(lessonResult);
			return response.data;
		},
		onSuccess: () => {
			// TODO 쿼리 무효 - query key 빠짐없이 넣기
			return queryClient.invalidateQueries({
				queryKey: learningKeys.all,
			});
		},
	});

	return {
		...query,
	};
};
