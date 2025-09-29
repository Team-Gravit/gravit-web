import type { ApiErrorResponse, ApiResponse } from "@/shared/api/types";
import type {
	LearningResultRequestDTO,
	LearningResultResponseDTO,
	SubmitReportRequestDTO,
	SubmitResultRequestDTO,
	SubmitResultResponseDTO,
} from "./dto";
import { apiClient } from "@/shared/api/config";

export const quizApi = {
	// 답안 제출
	saveLearningResult: async (
		request: LearningResultRequestDTO,
	): Promise<LearningResultResponseDTO> => {
		const response = await apiClient.post<
			ApiResponse<LearningResultResponseDTO>
		>("/api/v1/learning/results", request);
		if ("error" in response.data) {
			throw new Error(response.data.message);
		}
		return response.data;
	},

	// 문제 신고
	submitReport: async (request: SubmitReportRequestDTO): Promise<void> => {
		/**TODO - <ApiErrorResponse>이게 옳은지 확인해봐야 함. */
		const response = await apiClient.post<ApiResponse<ApiErrorResponse>>(
			"/learning/reports",
			request,
		);
		console.log("response", response);
		if (response.status >= 200 && response.status < 300) {
			return;
		}
		throw new Error(response.data.message);
	},

	// 결과 제출
	submitResult: async (
		request: SubmitResultRequestDTO,
	): Promise<SubmitResultResponseDTO> => {
		const response = await apiClient.post<ApiResponse<SubmitResultResponseDTO>>(
			"/learning/results",
			request,
		);
		console.log("response", response);
		if ("error" in response.data) {
			throw new Error(response.data.message);
		}

		return response.data;
	},
};
