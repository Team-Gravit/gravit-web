import type { AxiosRequestConfig } from 'axios';

import { privateApiClient } from './config';

export const customInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await privateApiClient.request<T>(config);
  return response.data;
};
