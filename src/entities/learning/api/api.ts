import type { ApiResponse } from "@/shared/api/types";
import { apiClient } from "@/shared/api/config";
import type { Chapter } from "../model/types";
import type { ChapterDetailResponseDTO } from "./dto";

export const learningApi = {
	/** 전체 챕터 리스트 정보 */
	getChapterList: async (): Promise<Chapter[]> => {
		const response =
			await apiClient.get<ApiResponse<Chapter[]>>(`/learning/chapters`);
		if ("error" in response.data) {
			throw new Error(response.data.message);
		}

		return response.data;
	},

	/** 챕터의 유닛 정보 */
	getUnitList: async (chapterId: number): Promise<ChapterDetailResponseDTO> => {
		const response = await apiClient.get<ApiResponse<ChapterDetailResponseDTO>>(
			`/learning/${chapterId}/units`,
		);

		if ("error" in response.data) {
			throw new Error(response.data.message);
		}

		return response.data;
	},
};
