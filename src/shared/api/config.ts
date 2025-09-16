import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";

// 토큰 관리 - 액세스 토큰은 메모리, 리프레시 토큰은 로컬스토리지
let accessToken: string | null = null;

export const tokenManager = {
	getAccessToken: () => accessToken,
	getRefreshToken: () => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("refreshToken");
		}
		return null;
	},
	setTokens: (newAccessToken: string, newRefreshToken?: string) => {
		accessToken = newAccessToken;
		if (
			newRefreshToken &&
			typeof window !== "undefined" &&
			window.localStorage
		) {
			localStorage.setItem("refreshToken", newRefreshToken);
		}
	},
	clearTokens: () => {
		accessToken = null;
		if (typeof window !== "undefined") {
			window.localStorage?.removeItem("refreshToken");
		}
	},
};

// API 기본 URL
const API_BASE_URL =
	import.meta.env.PUBLIC_API_BASE_URL || "https://grav-it.inuappcenter.kr";

// axios 인스턴스
export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
	(config) => {
		const token = tokenManager.getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

interface RetryableRequest extends InternalAxiosRequestConfig {
	retry?: boolean;
}

// 응답 인터셉터 - 토큰 갱신 및 에러 처리
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
						{
							refreshToken,
						},
					);

					const result = refreshResponse.data?.result;
					if (result?.accessToken) {
						tokenManager.setTokens(result.accessToken, result.refreshToken);

						// 원래 요청 재시도
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
						}
						return apiClient(originalRequest);
					} else {
						throw new Error("Invalid refresh response");
					}
				} catch (refreshError) {
					console.error("Token refresh failed:", refreshError);
					tokenManager.clearTokens();
					if (typeof window !== "undefined") {
						window.location.href = "/login";
					}
				}
			} else {
				tokenManager.clearTokens();
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
			}
		}

		return Promise.reject(error);
	},
);
