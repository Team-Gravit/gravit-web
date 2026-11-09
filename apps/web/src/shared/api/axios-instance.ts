import Axios, {
  isAxiosError,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { getApiBaseUrl } from '@/shared/config';

import { getAuthToken, notifyUnauthorized } from './auth-token';
import { isRefreshRejected, refreshAccessToken } from './refresh-token';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 재발급 요청임을 표시한다. 토큰 부착과 갱신 재시도를 건너뛴다. */
    skipAuthRefresh?: boolean;
    /** 갱신 후 요청이 다시 실패해도 재발급을 반복하지 않는다. */
    isRetried?: boolean;
  }
}

export const API_REQUEST_TIMEOUT_MS = 15_000;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_REQUEST_TIMEOUT_MS,
  // 웹 refreshToken 쿠키를 주고받는다. 쿠키는 Path=/api/v1/auth 라 다른 API 요청에는 실리지 않는다.
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  // 재발급 요청은 토큰을 싣지 않고, 재시도 요청은 갱신으로 받은 토큰을 이미 달고 있다.
  if (config.skipAuthRefresh || config.isRetried) {
    return config;
  }

  const accessToken = getAuthToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const canRetry =
      error.response?.status === 401 && config && !config.skipAuthRefresh && !config.isRetried;

    if (!canRetry) {
      throw error;
    }

    config.isRetried = true;

    let accessToken: string;
    try {
      accessToken = await refreshAccessToken();
    } catch (refreshError) {
      if (isRefreshRejected(refreshError)) {
        notifyUnauthorized();
      }

      throw refreshError;
    }

    config.headers.set('Authorization', `Bearer ${accessToken}`);

    try {
      return await AXIOS_INSTANCE.request(config);
    } catch (retryError) {
      // 새 토큰도 거절된 경우에만 세션을 지운다. 권한 오류나 일시 장애는 로그아웃시키지 않는다.
      if (isAxiosError(retryError) && retryError.response?.status === 401) {
        notifyUnauthorized();
      }

      throw retryError;
    }
  },
);

export async function customInstance<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await AXIOS_INSTANCE.request<T>({
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
    },
  });

  return response.data;
}

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
