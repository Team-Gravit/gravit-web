import { apiClient } from "@/shared/api/config";

export type LoginProvider = "google" | "kakao" | "naver";

export async function requestLoginUrl(
	provider: LoginProvider,
): Promise<string> {
	const dest = process.env.VITE_ENVIRONMENT === "production" ? "prod" : "local";
	const { data } = await apiClient.get<{ loginUrl: string }>(
		`oauth/login-url/${provider}?dest=${dest}`,
	);
	return data.loginUrl;
}
