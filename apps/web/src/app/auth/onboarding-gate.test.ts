import { describe, expect, it } from 'vitest';

import { getOnboardingRedirect } from './onboarding-gate';

describe('getOnboardingRedirect', () => {
  it.each([
    ['/onboarding', null],
    ['/onboarding/', null],
    ['/onboarding/success', '/onboarding'],
    ['/main', '/onboarding'],
    ['/settings/inquiry', '/onboarding'],
  ])('미온보딩 사용자가 %s 에 들어오면 %s 를 반환한다', (pathname, destination) => {
    expect(getOnboardingRedirect(pathname, false)).toBe(destination);
  });

  it.each([
    ['/onboarding', '/main'],
    ['/onboarding/', '/main'],
    ['/onboarding/success', null],
    ['/main', null],
    ['/settings/inquiry', null],
  ])('온보딩 완료 사용자가 %s 에 들어오면 %s 를 반환한다', (pathname, destination) => {
    expect(getOnboardingRedirect(pathname, true)).toBe(destination);
  });
});
