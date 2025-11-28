import { api } from "@/shared/api";

export type LoginProvider = "google" | "kakao" | "naver";

export async function getLoginUrl(provider: LoginProvider): Promise<string> {
	const dest = import.meta.env.MODE === "development" ? "local" : "prod";

	const { data } = await api.auth.oAuth.authorizeUrl(provider, dest);
	return data.loginUrl;
}
