import { privateApiClient } from "@/shared/api/config";

export type LoginProvider = "google" | "kakao" | "naver";

export async function requestLoginUrl(
	provider: LoginProvider,
): Promise<string> {
	const dest = import.meta.env.VITE_ENVIRONMENT === "local" ? "local" : "prod";

	const { data } = await privateApiClient.get<{ loginUrl: string }>(
		`oauth/login-url/${provider}?dest=${dest}`,
	);
	return data.loginUrl;
}
