import { describe, expect, it } from 'vitest';

import { isAllowedBridgeOrigin } from './bridge-origin';

const ALLOWED_URL = 'https://dev.gravit.inuappcenter.kr/';

describe('isAllowedBridgeOrigin', () => {
  it.each([
    'https://dev.gravit.inuappcenter.kr/',
    'https://dev.gravit.inuappcenter.kr/main',
    'https://dev.gravit.inuappcenter.kr?tab=1',
    'HTTPS://DEV.gravit.inuappcenter.kr/main',
  ])('같은 origin 인 %s 는 true 를 반환한다', (messageUrl) => {
    expect(isAllowedBridgeOrigin(messageUrl, ALLOWED_URL)).toBe(true);
  });

  it.each([
    'https://evil.example/',
    'http://dev.gravit.inuappcenter.kr/',
    'https://dev.gravit.inuappcenter.kr.evil.example/',
    'https://dev.gravit.inuappcenter.kr@evil.example/',
    'https://dev.gravit.inuappcenter.kr:8443/',
    'not a url',
    '',
  ])('%s 는 false 를 반환한다', (messageUrl) => {
    expect(isAllowedBridgeOrigin(messageUrl, ALLOWED_URL)).toBe(false);
  });

  it('포트까지 같은 개발 주소는 true 를 반환한다', () => {
    expect(
      isAllowedBridgeOrigin('http://192.168.45.191:5173/main', 'http://192.168.45.191:5173'),
    ).toBe(true);
  });
});
