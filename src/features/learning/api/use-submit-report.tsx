import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReportType } from "@/features/quiz/submit-report/ui/ReportModal";
import { api } from "@/shared/api";

export const useSubmitReport = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			reportType,
			content,
			problemId,
		}: {
			reportType: ReportType;
			content: string;
			problemId: number;
		}) => {
			const response = await api.learning.submitProblemReport({
				reportType,
				content,
				problemId,
			});
			return response.data;
		},
		onSuccess: () => {
			/** TODO - 토스트메세지로 바꿔야 할 부분 */
			alert("문제 오류를 전송했습니다.!");

			// 쿼리 무효 - query key 추후에 수정
			return queryClient.invalidateQueries({
				queryKey: ["data"],
			});
		},
	});
};
