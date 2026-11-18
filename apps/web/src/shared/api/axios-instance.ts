import Axios, {
  isAxiosError,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { getApiBaseUrl } from '@/shared/config';

import { getAuthToken, notifyUnauthorized } from './auth-token';
import { isRefreshRejected, refreshAccessToken } from './refresh-token';
import { isWithdrawnUserTokenError } from './withdrawn-user-token';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 재발급 요청임을 표시한다. 토큰 부착과 갱신 재시도를 건너뛴다. */
    skipAuthRefresh?: boolean;
    /** 갱신 후 요청이 다시 실패해도 재발급을 반복하지 않는다. */
    isRetried?: boolean;
  }
}

// 조회는 다시 불러도 손해가 없으니 빨리 실패를 보여 주고 다시 시도하게 한다.
export const API_READ_TIMEOUT_MS = 8_000;
// 저장 · 변경 · 토큰 재발급은 앱이 포기해도 서버가 이미 처리했을 수 있다.
// 짧으면 다시 눌러 두 번 저장되거나, 바뀐 토큰을 못 받아 로그아웃될 수 있어 길게 둔다.
export const API_WRITE_TIMEOUT_MS = 15_000;

function resolveTimeoutMs(method: string | undefined): number {
  return (method ?? 'get').toLowerCase() === 'get' ? API_READ_TIMEOUT_MS : API_WRITE_TIMEOUT_MS;
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_WRITE_TIMEOUT_MS,
  // 웹 refreshToken 쿠키를 주고받는다. 쿠키는 Path=/api/v1/auth 라 다른 API 요청에는 실리지 않는다.
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  // 재시도 요청도 같은 기준을 받도록 아래 조기 반환보다 먼저 정한다.
  config.timeout = resolveTimeoutMs(config.method);

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

    // 계정이 없어진 토큰은 재발급해도 살아나지 않는다. 재발급 에러로 원래 응답을 가리지 않도록
    // 세션만 지우고 원래 에러를 그대로 넘겨, 호출부가 탈퇴 여부를 판단할 수 있게 한다.
    if (isWithdrawnUserTokenError(error)) {
      notifyUnauthorized();
      throw error;
    }

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
