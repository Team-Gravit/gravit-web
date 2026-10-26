import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useNicknameStatus } from './use-nickname-status';

const NICKNAME_CHECK_DELAY_MS = 300;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useNicknameStatus', () => {
  it('빈 값이면 default 다', () => {
    const { result } = renderHook(({ nickname }) => useNicknameStatus(nickname), {
      initialProps: { nickname: '' },
    });

    expect(result.current).toBe('default');
  });

  it('입력 직후 디바운스 전에는 checking 이다', () => {
    const { result, rerender } = renderHook(({ nickname }) => useNicknameStatus(nickname), {
      initialProps: { nickname: '' },
    });

    rerender({ nickname: '그래빗' });

    expect(result.current).toBe('checking');
  });

  it('디바운스 후 규칙에 맞으면 valid 다', () => {
    const { result, rerender } = renderHook(({ nickname }) => useNicknameStatus(nickname), {
      initialProps: { nickname: '' },
    });

    rerender({ nickname: '그래빗' });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current).toBe('valid');
  });

  it('디바운스 후 규칙에 어긋나면 invalid 다', () => {
    const { result, rerender } = renderHook(({ nickname }) => useNicknameStatus(nickname), {
      initialProps: { nickname: '' },
    });

    rerender({ nickname: '!!!' });
    act(() => {
      vi.advanceTimersByTime(NICKNAME_CHECK_DELAY_MS);
    });

    expect(result.current).toBe('invalid');
  });

  it('초기값이 유효한 닉네임이면 디바운스 없이 valid 다', () => {
    const { result } = renderHook(({ nickname }) => useNicknameStatus(nickname), {
      initialProps: { nickname: '한준서' },
    });

    expect(result.current).toBe('valid');
  });
});
