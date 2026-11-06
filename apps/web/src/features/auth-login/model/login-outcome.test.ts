import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { readWithdrawnProviderId, resolveLoginDestination } from './login-outcome';

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

describe('resolveLoginDestination', () => {
  it('isOnboarded 가 true 면 /main 을 반환한다', () => {
    expect(resolveLoginDestination({ isOnboarded: true })).toBe('/main');
  });

  it('isOnboarded 가 false 면 /onboarding 을 반환한다', () => {
    expect(resolveLoginDestination({ isOnboarded: false })).toBe('/onboarding');
  });
});

describe('readWithdrawnProviderId', () => {
  it('423 USER_423 응답이면 message 의 providerId 를 반환한다', () => {
    const error = createAxiosError(423, { error: 'USER_423', message: 'pid_9' });

    expect(readWithdrawnProviderId(error)).toBe('pid_9');
  });

  it('error 코드가 다르면 null 을 반환한다', () => {
    const error = createAxiosError(400, { error: 'USER_400', message: 'pid_9' });

    expect(readWithdrawnProviderId(error)).toBeNull();
  });

  it('message 가 문자열이 아니면 null 을 반환한다', () => {
    const error = createAxiosError(423, { error: 'USER_423', message: { id: 'pid_9' } });

    expect(readWithdrawnProviderId(error)).toBeNull();
  });

  it('axios 에러가 아니면 null 을 반환한다', () => {
    expect(readWithdrawnProviderId(new Error('USER_423'))).toBeNull();
  });
});
