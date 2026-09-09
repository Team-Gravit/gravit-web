import { describe, expect, it } from 'vitest';

import { isLoginProvider } from './get-login-url';

describe('isLoginProvider', () => {
  it.each(['google', 'kakao', 'naver'])('%s 는 지원하는 provider 다', (value) => {
    expect(isLoginProvider(value)).toBe(true);
  });

  it.each(['facebook', 'GOOGLE', '', 'google '])('%s 는 지원하지 않는다', (value) => {
    expect(isLoginProvider(value)).toBe(false);
  });
});
