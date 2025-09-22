import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { PostOAuth } from "@/features/login/api/postOauth";
import type { PostOAuthResponse } from "@/features/login/api/postOauth";

interface PostOAuthVariables {
	provider: string;
	code: string;
}

export function usePostOAuth(): UseMutationResult<
	PostOAuthResponse,
	unknown,
	PostOAuthVariables
> {
	return useMutation<PostOAuthResponse, unknown, PostOAuthVariables>({
		mutationFn: ({ provider, code }: PostOAuthVariables) =>
			PostOAuth(provider, code),
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
