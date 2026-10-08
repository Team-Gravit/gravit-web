import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSessionFollowState } from './use-session-follow-state';

describe('useSessionFollowState', () => {
  it('markFollowed 한 userId 는 isFollowing 이 true 다', () => {
    const { result } = renderHook(() => useSessionFollowState(1));

    act(() => result.current.markFollowed(1));

    expect(result.current.isFollowing(1)).toBe(true);
  });

  it('markUnfollowed 하면 isFollowing 이 false 로 돌아온다', () => {
    const { result } = renderHook(() => useSessionFollowState(1));

    act(() => result.current.markFollowed(1));
    act(() => result.current.markUnfollowed(1));

    expect(result.current.isFollowing(1)).toBe(false);
  });

  it('dataUpdatedAt 이 바뀌면(=refetch) 로컬 set 이 비워진다', () => {
    const { result, rerender } = renderHook(({ t }) => useSessionFollowState(t), {
      initialProps: { t: 1 },
    });

    act(() => result.current.markFollowed(1));
    expect(result.current.isFollowing(1)).toBe(true);

    rerender({ t: 2 });
    expect(result.current.isFollowing(1)).toBe(false);
  });

  it('dataUpdatedAt 이 그대로면 set 을 유지한다', () => {
    const { result, rerender } = renderHook(({ t }) => useSessionFollowState(t), {
      initialProps: { t: 1 },
    });

    act(() => result.current.markFollowed(1));
    rerender({ t: 1 });

    expect(result.current.isFollowing(1)).toBe(true);
  });
});
