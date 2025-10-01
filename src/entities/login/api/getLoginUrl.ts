import { apiClient } from "@/shared/api/config";

export type LoginProvider = "google" | "kakao" | "naver";

export async function getLoginUrl(provider: LoginProvider): Promise<string> {
	const dest =
		import.meta.env.VITE_ENVIRONMENT === "production" ? "prod" : "local";
	const { data } = await apiClient.get<{ loginUrl: string }>(
		`oauth/login-url/${provider}?dest=${dest}`,
	);
	return data.loginUrl;
}
