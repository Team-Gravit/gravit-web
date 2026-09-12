import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDelayedFlag } from './use-delayed-flag';

afterEach(() => {
  vi.useRealTimers();
});

describe('useDelayedFlag', () => {
  it('delayMs 가 지나기 전에는 false 다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDelayedFlag(true, 300));

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe(false);
  });

  it('active 가 delayMs 이상 지속되면 true 가 된다', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDelayedFlag(true, 300));

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(true);
  });

  it('delayMs 안에 active 가 false 로 바뀌면 계속 false 다', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ active }) => useDelayedFlag(active, 300), {
      initialProps: { active: true },
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ active: false });

    expect(result.current).toBe(false);
  });

  it('true 가 된 뒤 active 가 false 로 바뀌면 다시 false 로 리셋된다', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ active }) => useDelayedFlag(active, 300), {
      initialProps: { active: true },
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(true);

    rerender({ active: false });

    expect(result.current).toBe(false);
  });
});
