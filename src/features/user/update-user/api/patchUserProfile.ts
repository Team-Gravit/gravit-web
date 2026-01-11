import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { AxiosError } from "axios";
import type { UserProfile } from "@/entities/user/model/types";
import { mapToUserProfile } from "@/entities/user/model/mappers";
import type {
	UserProfileUpdateRequest,
	UserResponse,
} from "@/shared/api/@generated";

export const usePatchUserProfile = () => {
	const queryClient = useQueryClient();

	return useMutation<UserProfile, AxiosError, UserProfileUpdateRequest>({
		mutationKey: ["patch-user-profile"],

		mutationFn: async (updateRequest) => {
			const res = await api.private.user.updateProfile(updateRequest);

			return mapToUserProfile(res.data as UserResponse);
		},

		onSuccess: (data) => {
			queryClient.setQueryData<UserProfile>(["user-info"], (oldData) => {
				if (!oldData) return data;
				return {
					...oldData,
					...data,
				};
			});
		},

		onError: (error: AxiosError) => {
			console.error("프로필 수정 실패:", error.message);
		},
	});
};
