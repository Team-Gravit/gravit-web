import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quizApi } from "../api/api";
import type { SubmitResultRequestDTO } from "../api/dto";

export const useSubmitQuizResult = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: SubmitResultRequestDTO) =>
			quizApi.submitResult(request),
		onSuccess: (data) => {
			console.log("퀴즈 결과 제출 성공:", data);
			queryClient.invalidateQueries({
				queryKey: ["units"],
			});
		},
		onError: (error) => {
			console.error("퀴즈 결과 제출 실패:", error);
		},
	});
};
