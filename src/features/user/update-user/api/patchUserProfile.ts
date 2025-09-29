import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/config";
import type { AxiosError } from "axios";
import type { UserProfile } from "@/entities/user/model/types";

export const patchUserProfile = async (
	nickname: string,
	profilePhotoNumber: number,
): Promise<UserProfile> => {
	const { data } = await apiClient.patch<UserProfile>("/users", {
		nickname,
		profilePhotoNumber,
	});
	return data;
};

export const usePatchUserProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables: { nickname: string; profilePhotoNumber: number }) =>
			patchUserProfile(variables.nickname, variables.profilePhotoNumber),

		onSuccess: (data) => {
			queryClient.setQueryData(
				["userinfo"],
				(oldData: UserProfile | undefined) => {
					if (!oldData) return data;
					return {
						...oldData,
						...data,
					};
				},
			);
		},

		onError: (error: AxiosError) => {
			console.error("프로필 수정 실패:", error.message);
		},
	});
};
