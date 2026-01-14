import { useMutation } from "@tanstack/react-query";
import { useLessonModalStore } from "@/features/quiz/model/use-lesson-modal-store";
import type { ReportType } from "@/features/quiz/ui/modal/ReportModal";
import { api } from "@/shared/api";

export const useSubmitReport = () => {
	const { closeReportModal, openResultModal } = useLessonModalStore();
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
			const response = await api.private.report.submitProblemReport({
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
