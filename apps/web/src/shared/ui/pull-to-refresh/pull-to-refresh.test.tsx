import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Toaster } from '@/shared/ui/toast';

import { PULL_TO_REFRESH_FAILURE_MESSAGE, PullToRefresh } from './pull-to-refresh';

// jsdom에는 Touch 생성자가 없어 touches만 채운 이벤트를 만든다.
function dispatchTouch(target: Element, type: string, fingerY?: number) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touches = fingerY === undefined ? [] : [{ clientX: 0, clientY: fingerY }];
  Object.defineProperty(event, 'touches', { value: touches });
  act(() => {
    target.dispatchEvent(event);
  });
}

// 손가락 300px는 고무줄 저항을 거쳐 임계 거리를 넘는다.
function pullAndRelease(target: Element) {
  dispatchTouch(target, 'touchstart', 0);
  dispatchTouch(target, 'touchmove', 300);
  dispatchTouch(target, 'touchend');
}

describe('PullToRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('새로고침 중이면 role="status" 에 「새로고침 중」을 알린다', () => {
    render(
      <PullToRefresh onRefresh={() => new Promise(() => {})}>
        <p>목록</p>
      </PullToRefresh>,
    );

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    pullAndRelease(screen.getByText('목록'));

    expect(screen.getByRole('status')).toHaveTextContent('새로고침 중');
  });

  it('onRefresh 가 실패하면 실패 토스트를 띄우고 상태 안내를 지운다', async () => {
    render(
      <>
        <PullToRefresh onRefresh={() => Promise.reject(new Error('network'))}>
          <p>목록</p>
        </PullToRefresh>
        <Toaster />
      </>,
    );

    pullAndRelease(screen.getByText('목록'));
    await act(() => vi.advanceTimersByTimeAsync(600));

    expect(screen.getByText(PULL_TO_REFRESH_FAILURE_MESSAGE)).toBeInTheDocument();
    expect(screen.getAllByRole('status')[0]).toHaveTextContent('');
  });
});
