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
		onError: () => {},
	});
}
