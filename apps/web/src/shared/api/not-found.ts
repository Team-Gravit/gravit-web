import { isAxiosError } from 'axios';

export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

/**
 * 요청이 Axios 404로 실패하면 `null`을 반환하고, 다른 오류는 그대로 던진다.
 */
export async function nullIfNotFound<T>(request: () => Promise<T>): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}
