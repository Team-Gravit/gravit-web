import { apiClient } from "@/shared/api/config";

export interface PostOAuthResponse {
	accessToken: string;
	isOnboarded: boolean;
}

export async function PostOAuth(
	provider: string,
	code: string,
): Promise<PostOAuthResponse> {
	const dest = import.meta.env.VITE_ENVIRONMENT === "local" ? "local" : "prod";
	const { data } = await apiClient.post<PostOAuthResponse>(
		`/oauth/${provider}?dest=${dest}`,
		{ code },
	);
	return data;
}
