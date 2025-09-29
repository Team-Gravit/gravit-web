import { useMutation } from "@tanstack/react-query";
import { getLoginUrl } from "@/entities/login/api/getLoginUrl";

/*
 OAuth 로그인 훅
 - 버튼 클릭 시 호출
 - 성공 시 로그인 URL로 리디렉션
 */

export function useOauthLogin() {
	return useMutation({
		mutationFn: getLoginUrl,
		onSuccess: (loginUrl: string) => {
			localStorage.setItem("returnTo", window.location.pathname);

			window.location.href = loginUrl;
		},
		onError: (error: unknown) => {
			console.error("OAuth 로그인 중 오류 발생:", error);
			alert("로그인 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
		},
	});
}
