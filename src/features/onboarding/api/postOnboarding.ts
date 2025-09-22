// src/features/onboarding/api/postOnBoarding.ts
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";

export interface OnBoardingResponse {
	id: string;
	nickname: string;
	profilePhotoUrl: string;
	createdAt: string;
	updatedAt: string;
}

export const PostOnBoarding = async (
	nickname: string,
	profilePhotoNumber: number,
): Promise<OnBoardingResponse> => {
	try {
		// 토큰을 로컬스토리지에서 직접 가져옴
		const accessToken = localStorage.getItem("accessToken");

		const { data } = await apiClient.post<OnBoardingResponse>(
			"/users/me/onboarding",
			{ nickname, profilePhotoNumber },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				withCredentials: true, // PatchOnBoarding과 동일
			},
		);

		return data;
	} catch (error) {
		const axiosError = error as AxiosError;

		if (axiosError.isAxiosError) {
			if (axiosError.response) {
				console.error(
					"Error response:",
					axiosError.response.status,
					axiosError.response.data,
				);
			} else if (axiosError.request) {
				console.error("No response received:", axiosError.request);
			} else {
				console.error("Request setup error:", axiosError.message);
			}
		} else {
			console.error("Unexpected error:", error);
		}

		throw error;
	}
};
