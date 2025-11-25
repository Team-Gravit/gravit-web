import type { ApiResponse } from "@/shared/api/types";
import { apiClient } from "@/shared/api/config";
import type { MainPageResponseDTO } from "./dto";
export const mainPageApi = {
	getMainInfo: async (): Promise<MainPageResponseDTO> => {
		const response =
			await apiClient.get<ApiResponse<MainPageResponseDTO>>(`/users/main-page`);
		if ("error" in response.data) {
			throw new Error(response.data.message);
		}

		return response.data;
	},
};
