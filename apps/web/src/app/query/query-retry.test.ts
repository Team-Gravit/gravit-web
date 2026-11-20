import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';

import { shouldRetryQuery } from './query-retry';

function httpError(status: number): AxiosError {
  const response = {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: null,
  } as AxiosResponse;

  return new AxiosError('failed', AxiosError.ERR_BAD_RESPONSE, undefined, undefined, response);
}

const NETWORK_ERROR = new AxiosError('Network Error', AxiosError.ERR_NETWORK);
const TIMEOUT_ERROR = new AxiosError('timeout', AxiosError.ECONNABORTED);

describe('shouldRetryQuery', () => {
  it('응답 없는 네트워크 오류는 2번까지 다시 시도한다', () => {
    expect(shouldRetryQuery(0, NETWORK_ERROR)).toBe(true);
    expect(shouldRetryQuery(1, NETWORK_ERROR)).toBe(true);
    expect(shouldRetryQuery(2, NETWORK_ERROR)).toBe(false);
  });

  it('5xx 는 2번까지 다시 시도한다', () => {
    expect(shouldRetryQuery(0, httpError(503))).toBe(true);
    expect(shouldRetryQuery(1, httpError(500))).toBe(true);
    expect(shouldRetryQuery(2, httpError(500))).toBe(false);
  });

  it('타임아웃은 1번만 다시 시도한다', () => {
    expect(shouldRetryQuery(0, TIMEOUT_ERROR)).toBe(true);
    expect(shouldRetryQuery(1, TIMEOUT_ERROR)).toBe(false);
  });

  it.each([400, 401, 403, 404])('%i 는 다시 시도하지 않는다', (status) => {
    expect(shouldRetryQuery(0, httpError(status))).toBe(false);
  });

  it('axios 밖의 오류는 다시 시도하지 않는다', () => {
    expect(shouldRetryQuery(0, new Error('parse failed'))).toBe(false);
  });
});
