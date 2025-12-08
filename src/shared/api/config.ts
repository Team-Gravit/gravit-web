import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { Configuration } from "./@generated";

// 토큰 관리
// let accessToken: string | null = null;

export const tokenManager = {
	getAccessToken: () => localStorage.getItem("accessToken"),
	getRefreshToken: () =>
		typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
	setTokens: (newAccessToken: string, newRefreshToken?: string) => {
		// accessToken = newAccessToken;
		if (typeof window !== "undefined") {
			localStorage.setItem("accessToken", newAccessToken);
			if (newRefreshToken)
				localStorage.setItem("refreshToken", newRefreshToken);
		}
	},
	clearTokens: () => {
		// accessToken = null;
		if (typeof window !== "undefined") {
			localStorage.removeItem("accessToken");
			// localStorage.removeItem("refreshToken");
		}
	},
};

// 앱 초기화 시 localStorage accessToken 세팅
if (typeof window !== "undefined") {
	const savedAccessToken = localStorage.getItem("accessToken");
	if (savedAccessToken) tokenManager.setTokens(savedAccessToken);
}

// API 기본 URL
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "https://grav-it.inuappcenter.kr";

// axios 인스턴스
export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: { "Content-Type": "application/json" },
});

export const authClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터 - JWT 자동 추가
apiClient.interceptors.request.use(
	(config) => {
		if (config.url?.includes("/oauth")) return config; // OAuth 요청은 토큰 제외

		const token = tokenManager.getAccessToken();
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error),
);

// 응답 인터셉터 - 토큰 갱신 처리
interface RetryableRequest extends InternalAxiosRequestConfig {
	retry?: boolean;
}

// OpenAPI Configuration
export const privateApiConfiguration = new Configuration({
	basePath: API_BASE_URL,
	accessToken: () => {
		const token = tokenManager.getAccessToken();
		return token || "";
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as RetryableRequest;

		if (error.response?.status === 401 && !originalRequest.retry) {
			originalRequest.retry = true;

			const refreshToken = tokenManager.getRefreshToken();
			if (refreshToken) {
				try {
					const refreshResponse = await axios.post(
						`${API_BASE_URL}/auth/refresh`,
						{ refreshToken },
					);
					const result = refreshResponse.data?.result;

					if (result?.accessToken) {
						tokenManager.setTokens(result.accessToken, result.refreshToken);
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
						}
						return apiClient(originalRequest);
					}
				} catch (err) {
					console.error("Refresh token failed", err);
					tokenManager.clearTokens();
					if (typeof window !== "undefined") window.location.href = "/";
				}
			} else {
				tokenManager.clearTokens();
				if (typeof window !== "undefined") window.location.href = "/";
			}
		}

		return Promise.reject(error);
	},
);
