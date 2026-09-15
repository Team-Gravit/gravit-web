import { describe, expect, it } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';

import { isNotFoundError, nullIfNotFound } from './not-found';

function createAxiosError(status: number) {
  return new AxiosError('fail', undefined, undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: null,
  });
}

describe('nullIfNotFound', () => {
  it('404 면 null 을 반환한다', async () => {
    await expect(nullIfNotFound(() => Promise.reject(createAxiosError(404)))).resolves.toBeNull();
  });

  it('404 가 아닌 에러는 그대로 던진다', async () => {
    const error = createAxiosError(500);
    await expect(nullIfNotFound(() => Promise.reject(error))).rejects.toBe(error);
  });

  it('성공 응답은 그대로 돌려준다', async () => {
    await expect(nullIfNotFound(() => Promise.resolve({ ok: true }))).resolves.toEqual({
      ok: true,
    });
  });

  it('axios 에러가 아니면 404 로 보지 않는다', () => {
    expect(isNotFoundError(new Error('404'))).toBe(false);
  });
});
