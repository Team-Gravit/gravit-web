import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { AuthCodeRequest } from "@/shared/api/@generated";
import { toast } from "@/shared/lib/toast";
import type { AxiosError } from "axios";
import { useRouter } from "@tanstack/react-router";

export function usePostOAuth() {
	const router = useRouter();

	return useMutation({
		mutationFn: async ({
			provider,
			dest,
			code,
		}: AuthCodeRequest & { dest: string; provider: string }) => {
			const response = await api.public.oAuth.oauthLogin(provider, dest, {
				code,
			});
			return response.data;
		},
		retry: false,
		onSuccess: (data) => {
			localStorage.setItem("accessToken", data.accessToken);

			if (data.isOnboarded) {
				window.location.href = "/main";
			} else {
				window.location.href = "/onboarding";
			}
		},
		onError: (error: AxiosError) => {
			if (error.response?.data) {
				const { error: errorCode, message } = error.response.data as {
					error: string;
					message: string;
				};
				if (errorCode === "USER_423") {
					router.navigate({
						to: "/restore",
						search: {
							providerId: message,
						},
					});
				} else {
					toast.error(message);
				}
			}
		},
	});
}
