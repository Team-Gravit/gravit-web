import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WIDE_VIEWPORT_MIN_WIDTH_PX, useIsWideViewport } from './use-is-wide-viewport';

/** matchMedia 를 교체하고, 매체 조건이 바뀌었음을 알리는 함수를 돌려준다. */
function stubMatchMedia(initialMatches: boolean) {
  const listeners = new Set<() => void>();
  let matches = initialMatches;

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      get matches() {
        return matches;
      },
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    })),
  );

  return function changeTo(nextMatches: boolean) {
    matches = nextMatches;
    listeners.forEach((listener) => listener());
  };
}

// vi.restoreAllMocks() 는 stubGlobal 로 바꾼 전역을 되돌리지 않는다. 직접 되돌린다.
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useIsWideViewport', () => {
  it(`매체 질의를 '(min-width: ${WIDE_VIEWPORT_MIN_WIDTH_PX}px)'로 만든다`, () => {
    stubMatchMedia(true);

    renderHook(() => useIsWideViewport());

    expect(window.matchMedia).toHaveBeenCalledWith(`(min-width: ${WIDE_VIEWPORT_MIN_WIDTH_PX}px)`);
  });

  it('매체 질의가 일치하면 true 를 반환한다', () => {
    stubMatchMedia(true);

    const { result } = renderHook(() => useIsWideViewport());

    expect(result.current).toBe(true);
  });

  it('매체 질의가 일치하지 않으면 false 를 반환한다', () => {
    stubMatchMedia(false);

    const { result } = renderHook(() => useIsWideViewport());

    expect(result.current).toBe(false);
  });

  it('구독 중에 매체 조건이 바뀌면 반환값이 갱신된다', () => {
    const changeTo = stubMatchMedia(false);
    const { result } = renderHook(() => useIsWideViewport());

    act(() => changeTo(true));

    expect(result.current).toBe(true);
  });

  it('matchMedia 가 없는 환경에서는 false 를 반환한다', () => {
    vi.stubGlobal('matchMedia', undefined);

    const { result } = renderHook(() => useIsWideViewport());

    expect(result.current).toBe(false);
  });
});
