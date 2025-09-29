import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { UserProfile } from "@/entities/user/model/types";

export const postOnBoarding = async (
	nickname: string,
	profilePhotoNumber: number,
): Promise<UserProfile> => {
	try {
		const accessToken = localStorage.getItem("accessToken");

		const { data } = await apiClient.post<UserProfile>(
			"/users/onboarding",
			{ nickname, profilePhotoNumber },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				withCredentials: true,
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
