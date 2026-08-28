import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

import { getAuthToken, notifyUnauthorized } from './auth-token';

export const API_REQUEST_TIMEOUT_MS = 15_000;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: API_REQUEST_TIMEOUT_MS,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const accessToken = getAuthToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
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
