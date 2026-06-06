import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { STORAGE_KEYS } from '../config/storage';
import { Configuration } from './@generated';

// 커스텀 에러 클래스

// 토큰 관리
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token || '');
    }
  });

  failedQueue = [];
};

export const tokenManager = {
  getAccessToken: () =>
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null,
  getRefreshToken: () =>
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.refreshToken) : null,
  setTokens: (newAccessToken: string, newRefreshToken?: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.accessToken, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, newRefreshToken);
      }
    }
  },
  clearTokens: () => {
    isRefreshing = false;
    refreshPromise = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEYS.accessToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
    }
  },
  refreshToken: async () => await refreshAccessToken(),
  getIsRefreshing: () => isRefreshing,
};

// API 기본 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://grav-it.inuappcenter.kr';

// axios 인스턴스
export const privateApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 - JWT 자동 추가
privateApiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken();
    const refreshToken = tokenManager.getRefreshToken();

    if (!accessToken && !refreshToken) {
      window.location.href = '/';
      return config;
    }

    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

const refreshAccessToken = async (): Promise<string> => {
  if (isRefreshing && refreshPromise) {
    // 이미 갱신 중이면 큐에 추가하고 대기
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      const error = new Error('No refresh token available');
      processQueue(error, null);
      tokenManager.clearTokens();

      throw error;
    }

    try {
      const refreshResponse = await publicApiClient.post(`/api/v1/auth/reissue`, {
        refreshToken,
      });

      const data = refreshResponse.data;
      if (data?.accessToken) {
        tokenManager.setTokens(data.accessToken);
        processQueue(null, data.accessToken);
        return data.accessToken;
      }

      const error = new Error('Invalid refresh response');
      processQueue(error, null);
      tokenManager.clearTokens();
      throw error;
    } catch (refreshError) {
      processQueue(new Error(String(refreshError)), null);
      tokenManager.clearTokens();
      throw refreshError;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const privateApiConfiguration = new Configuration({
  basePath: API_BASE_URL,
  // accessToken은 axios 인터셉터에서 처리하므로 여기서는 설정하지 않음
});

export const publicApiConfiguration = new Configuration({
  basePath: API_BASE_URL,
});

// 응답 인터셉터 - 토큰 갱신 및 에러 처리
privateApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError['config'] & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // 원래 요청 재시도 - 헤더 강제 업데이트
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateApiClient.request(originalRequest);
      } catch (refreshError) {
        // refreshError의 타입 확인
        if (axios.isAxiosError(refreshError)) {
          const retryStatus = refreshError.response?.status;

          // 🔑 핵심: 재요청이 403이면 토큰은 유효하지만 권한이 없는 것
          // 따라서 토큰을 삭제하지 않음
          if (retryStatus === 403) {
            console.warn('⚠️ 403 Forbidden: 토큰은 유효하지만 권한이 없습니다. 토큰 유지.');
            return Promise.reject(refreshError);
          }

          // 재요청도 401이거나, 토큰 재발급 자체가 실패한 경우만 토큰 삭제
          console.error('❌ Auth failed, clearing tokens');
        } else {
          // 토큰 재발급 자체가 실패 (네트워크 에러 등)
          console.error('❌ Token refresh failed:', refreshError);
        }

        tokenManager.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
