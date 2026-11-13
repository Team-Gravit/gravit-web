import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { isWithdrawnAccountError, readWithdrawnAccountError } from './withdrawn-account';

function createAxiosError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };

  return new AxiosError('request failed', 'ERR_BAD_REQUEST', config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data,
  });
}

describe('readWithdrawnAccountError', () => {
  it('USER_423 응답이면 message 를 함께 돌려준다', () => {
    const error = createAxiosError(423, { error: 'USER_423', message: 'kakao_1' });

    expect(readWithdrawnAccountError(error)).toEqual({ error: 'USER_423', message: 'kakao_1' });
  });

  it('error 코드가 다르면 null 을 반환한다', () => {
    expect(readWithdrawnAccountError(createAxiosError(404, { error: 'USER_404' }))).toBeNull();
  });

  it('axios 에러가 아니면 null 을 반환한다', () => {
    expect(readWithdrawnAccountError(new Error('x'))).toBeNull();
  });
});

describe('isWithdrawnAccountError', () => {
  it('message 가 없어도 USER_423 이면 true 를 반환한다', () => {
    expect(isWithdrawnAccountError(createAxiosError(423, { error: 'USER_423' }))).toBe(true);
  });
});
