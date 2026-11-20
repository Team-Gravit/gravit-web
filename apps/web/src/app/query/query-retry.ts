import { isAxiosError } from 'axios';

// 앱 복귀 직후처럼 네트워크가 불안정할 때 일시적인 조회 실패만 재시도한다.
const MAX_TRANSIENT_RETRY_COUNT = 2;
// 타임아웃은 요청 자체가 오래 걸리므로 한 번만 더 시도한다.
const MAX_TIMEOUT_RETRY_COUNT = 1;

const TIMEOUT_ERROR_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT']);

/** TanStack Query의 `failureCount`는 첫 실패에서 0부터 시작한다. */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  if (error.code && TIMEOUT_ERROR_CODES.has(error.code)) {
    return failureCount < MAX_TIMEOUT_RETRY_COUNT;
  }

  const status = error.response?.status;
  const isTransient = status === undefined || status >= 500;

  return isTransient && failureCount < MAX_TRANSIENT_RETRY_COUNT;
}
