import { describe, expect, it } from 'vitest';
import { isRedirect } from '@tanstack/react-router';

import { Route } from './success';

/**
 * 진입 가드만 직접 호출한다. 통과하면 `null`, 넘기면 목적지를 돌려준다.
 */
function runGuard(state: { fromOnboarding?: boolean }): string | null {
  const guard = Route.options.beforeLoad as unknown as (opts: {
    location: { state: { fromOnboarding?: boolean } };
  }) => void;

  try {
    guard({ location: { state } });
    return null;
  } catch (error) {
    // 목적지는 redirect 객체 자체가 아니라 `options` 안에 있다.
    if (isRedirect(error)) {
      return String(error.options.to);
    }

    throw error;
  }
}

describe('/onboarding/success 진입 가드', () => {
  it('온보딩 제출을 마치고 넘어오면 들여보낸다', () => {
    expect(runGuard({ fromOnboarding: true })).toBeNull();
  });

  it('통과권 없이 주소로 들어오면 /onboarding 으로 넘긴다', () => {
    // 목적지를 여기서 또 정하지 않는다. /onboarding 의 가드가
    // 「가입을 마쳤으면 /main」까지 이어서 판정한다.
    expect(runGuard({})).toBe('/onboarding');
  });
});
