import { useMutation } from "@tanstack/react-query";
import { tokenManager } from "@/shared/api/config";
import { api } from "@/shared/api";

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받는 훅
 *
 * @returns useMutation hook with refresh token logic
 */
export const useRefreshToken = () => {
	return useMutation({
		mutationFn: async (refreshToken: string) => {
			const response = await api.auth.refresh.reissueToken({
				refreshToken,
			});

			return response.data;
		},
		onSuccess: (data) => {
			if (data.accessToken) {
				tokenManager.setTokens(data.accessToken);
			}
		},
		onError: (error) => {
			console.error("Token refresh failed:", error);
			// 토큰 갱신 실패 시 토큰 제거
			tokenManager.clearTokens();
		},
	});
};
