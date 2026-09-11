import Axios, {
  isAxiosError,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { getApiBaseUrl } from '@/shared/config';

import { getAuthToken, notifyUnauthorized } from './auth-token';
import { refreshAccessToken } from './refresh-token';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 재발급 요청임을 표시한다. 토큰 부착과 갱신 재시도를 건너뛴다. */
    skipAuthRefresh?: boolean;
    /** 갱신 후 재시도한 요청임을 표시한다. 재시도는 1회로 제한한다. (기준선 C3) */
    isRetried?: boolean;
  }
}

export const API_REQUEST_TIMEOUT_MS = 15_000;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_REQUEST_TIMEOUT_MS,
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

    try {
      const accessToken = await refreshAccessToken();
      config.headers.set('Authorization', `Bearer ${accessToken}`);

      return await AXIOS_INSTANCE.request(config);
    } catch (retryError) {
      const isForbidden = isAxiosError(retryError) && retryError.response?.status === 403;

      // 403이면 토큰은 유효하고 권한만 없는 것이다. 세션을 지우지 않는다. (기준선 C4)
      if (!isForbidden) {
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
