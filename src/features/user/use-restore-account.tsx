import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";

/**
 * 소프트 삭제 계정 복구
 *
 * @returns useMutation hook with soft restore account logic
 */
export const useRestoreAccount = () => {
	return useMutation({
		mutationFn: async (providerId: string) => {
			const response = await api.public.userRestore.restoreUser(providerId);

			return response.data;
		},
	});
};
