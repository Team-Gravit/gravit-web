import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PULL_TO_REFRESH_FAILURE_MESSAGE } from '@/shared/ui/pull-to-refresh';
import { toast } from '@/shared/ui/toast';

import { CardRetryStatus } from './card-status';

vi.mock('@/shared/ui/toast', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui/toast')>();

  return { ...actual, toast: vi.fn() };
});

function getRetryButton() {
  return screen.getByRole('button', { name: '다시 시도' });
}

describe('CardRetryStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(toast).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('누르면 응답이 빨라도 600ms 동안 진행 중으로 보이고 다시 누를 수 없다', async () => {
    const onRetry = vi.fn(() => Promise.resolve());
    render(<CardRetryStatus sectionName="챕터 목록" onRetry={onRetry} />);

    fireEvent.click(getRetryButton());
    await act(() => vi.advanceTimersByTimeAsync(599));

    expect(getRetryButton()).toHaveAttribute('aria-busy', 'true');
    expect(getRetryButton()).toBeDisabled();
    fireEvent.click(getRetryButton());
    expect(onRetry).toHaveBeenCalledTimes(1);

    await act(() => vi.advanceTimersByTimeAsync(1));

    expect(getRetryButton()).not.toHaveAttribute('aria-busy');
    expect(toast).not.toHaveBeenCalled();
  });

  it('onRetry 가 거부되면 pull-to-refresh 와 같은 실패 토스트를 1회 띄운다', async () => {
    const onRetry = vi.fn(() => Promise.reject(new Error('network')));
    render(<CardRetryStatus sectionName="챕터 목록" onRetry={onRetry} />);

    fireEvent.click(getRetryButton());
    await act(() => vi.advanceTimersByTimeAsync(600));

    expect(toast).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(PULL_TO_REFRESH_FAILURE_MESSAGE);
    expect(getRetryButton()).not.toHaveAttribute('aria-busy');
  });
});
