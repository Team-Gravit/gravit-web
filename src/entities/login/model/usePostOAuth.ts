import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { AuthCodeRequest } from "@/shared/api/@generated";

export function usePostOAuth() {
	return useMutation({
		mutationFn: async ({
			provider,
			dest,
			code,
		}: AuthCodeRequest & { dest: string; provider: string }) => {
			const response = await api.auth.oAuth.oauthLogin(provider, dest, {
				code,
			});
			return response.data;
		},
		onSuccess: (data) => {
			localStorage.setItem("accessToken", data.accessToken);

			if (data.isOnboarded) {
				window.location.href = "/main";
			} else {
				window.location.href = "/onboarding";
			}
		},
		onError: (error) => {
			console.error("OAuth 로그인 실패:", error);
			alert("로그인 중 오류가 발생했습니다.");
			window.location.href = "/";
		},
	});
}
