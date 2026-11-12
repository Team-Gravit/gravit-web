import { afterEach, describe, expect, it } from 'vitest';

import { isNativeApp } from './native-environment';

const originalUserAgent = navigator.userAgent;

function stubUserAgent(userAgent: string) {
  Object.defineProperty(navigator, 'userAgent', { configurable: true, value: userAgent });
}

afterEach(() => {
  stubUserAgent(originalUserAgent);
});

describe('isNativeApp', () => {
  it('userAgent 에 GravitNative/ 가 있으면 true 를 반환한다', () => {
    stubUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) GravitNative/1.0');

    expect(isNativeApp()).toBe(true);
  });

  it('브라우저 userAgent 면 false 를 반환한다', () => {
    stubUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1');

    expect(isNativeApp()).toBe(false);
  });
});
