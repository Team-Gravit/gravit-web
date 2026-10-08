import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useInitialMinimumDuration } from './use-initial-minimum-duration';

const DURATION_MS = 2500;

describe('useInitialMinimumDuration', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('isActive가 바로 꺼져도 최소 시간 전까지는 true를 유지한다', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ isActive }) => useInitialMinimumDuration(isActive, DURATION_MS),
      { initialProps: { isActive: true } },
    );

    rerender({ isActive: false });
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(DURATION_MS - 1);
    });
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(false);
  });

  it('isActive가 처음부터 false여도 최소 시간 동안 true를 반환한다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useInitialMinimumDuration(false, DURATION_MS));

    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(DURATION_MS);
    });

    expect(result.current).toBe(false);
  });

  it('최소 시간이 지나면 이후에는 isActive를 그대로 반환한다', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ isActive }) => useInitialMinimumDuration(isActive, DURATION_MS),
      { initialProps: { isActive: false } },
    );

    act(() => {
      vi.advanceTimersByTime(DURATION_MS);
    });
    expect(result.current).toBe(false);

    rerender({ isActive: true });
    expect(result.current).toBe(true);

    rerender({ isActive: false });
    expect(result.current).toBe(false);
  });
});
