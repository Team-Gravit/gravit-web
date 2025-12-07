import { useMutation } from "@tanstack/react-query";
import type { ReportType } from "@/features/quiz/submit-report/ui/ReportModal";
import { api } from "@/shared/api";
import { useReportModalStore } from "@/features/quiz/model/use-report-modal-store";

export const useSubmitReport = () => {
	const { closeReportModal, openResultModal } = useReportModalStore();
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
			/** 신고 모달 닫기 */
			closeReportModal();

			/** 신고 제출 확인 모달 열기 */
			openResultModal();
		},
	});
};
