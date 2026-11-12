import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePullToRefresh } from './use-pull-to-refresh';

interface Point {
  x: number;
  y: number;
}

// jsdom에는 Touch 생성자가 없어 touches만 채운 이벤트를 만든다.
function dispatchTouch(target: Element, type: string, point?: Point): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touches = point ? [{ clientX: point.x, clientY: point.y }] : [];
  Object.defineProperty(event, 'touches', { value: touches });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

// 고무줄 저항이 적용되면 손가락 300px는 약 100px, 100px는 약 45px가 된다.
function pull(target: Element, fingerDistance: number): Event {
  dispatchTouch(target, 'touchstart', { x: 0, y: 0 });
  return dispatchTouch(target, 'touchmove', { x: 0, y: fingerDistance });
}

function release(target: Element) {
  dispatchTouch(target, 'touchend');
}

function setup(onRefresh: () => Promise<unknown> = () => Promise.resolve()) {
  const container = document.createElement('div');
  const touchTarget = document.createElement('button');
  container.append(touchTarget);
  document.body.append(container);

  const containerRef = { current: container };
  const onRefreshError = vi.fn();
  const { result } = renderHook(() =>
    usePullToRefresh({ containerRef, onRefresh, onRefreshError }),
  );

  return { container, touchTarget, result, onRefreshError };
}

describe('usePullToRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('임계 거리 미만으로 당기면 pulling 이 되고 preventDefault 한다', () => {
    const { touchTarget, result } = setup();

    const moveEvent = pull(touchTarget, 100);

    expect(result.current.status).toBe('pulling');
    expect(result.current.distance).toBeGreaterThan(0);
    expect(moveEvent.defaultPrevented).toBe(true);
  });

  it('임계 거리 이상 당기면 canRelease 가 된다', () => {
    const { touchTarget, result } = setup();

    pull(touchTarget, 300);

    expect(result.current.status).toBe('canRelease');
  });

  it('임계 거리 미만에서 놓으면 onRefresh 를 호출하지 않고 idle 로 돌아간다', () => {
    const onRefresh = vi.fn(() => Promise.resolve());
    const { touchTarget, result } = setup(onRefresh);

    pull(touchTarget, 100);
    release(touchTarget);

    expect(onRefresh).not.toHaveBeenCalled();
    expect(result.current).toEqual({ status: 'idle', distance: 0 });
  });

  it('임계 거리 이상에서 놓으면 onRefresh 를 호출하고 refreshing 이 된다', () => {
    const onRefresh = vi.fn(() => Promise.resolve());
    const { touchTarget, result } = setup(onRefresh);

    pull(touchTarget, 300);
    release(touchTarget);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('refreshing');
  });

  it('onRefresh 가 바로 끝나도 600ms 동안 refreshing 을 유지한다', async () => {
    const { touchTarget, result } = setup();

    pull(touchTarget, 300);
    release(touchTarget);
    await act(() => vi.advanceTimersByTimeAsync(599));
    expect(result.current.status).toBe('refreshing');

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current).toEqual({ status: 'idle', distance: 0 });
  });

  it('onRefresh 가 실패하면 onRefreshError 에 넘기고 idle 로 돌아간다', async () => {
    const error = new Error('network');
    const { touchTarget, result, onRefreshError } = setup(() => Promise.reject(error));

    pull(touchTarget, 300);
    release(touchTarget);
    await act(() => vi.advanceTimersByTimeAsync(600));

    expect(onRefreshError).toHaveBeenCalledWith(error);
    expect(result.current.status).toBe('idle');
  });

  it('refreshing 중에 다시 당겨도 onRefresh 를 한 번만 호출한다', () => {
    const onRefresh = vi.fn(() => new Promise(() => {}));
    const { touchTarget } = setup(onRefresh);

    pull(touchTarget, 300);
    release(touchTarget);
    const secondMoveEvent = pull(touchTarget, 300);
    release(touchTarget);

    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(secondMoveEvent.defaultPrevented).toBe(false);
  });

  it('위로 스크롤할 영역이 남아 있으면 당기기를 시작하지 않는다', () => {
    const { container, touchTarget, result } = setup();
    container.style.overflowY = 'auto';
    container.scrollTop = 40;

    const moveEvent = pull(touchTarget, 300);

    expect(result.current.status).toBe('idle');
    expect(moveEvent.defaultPrevented).toBe(false);
  });

  it('가로로 먼저 움직이면 이후 아래로 움직여도 당기기를 시작하지 않는다', () => {
    const { touchTarget, result } = setup();

    dispatchTouch(touchTarget, 'touchstart', { x: 0, y: 0 });
    dispatchTouch(touchTarget, 'touchmove', { x: 20, y: 4 });
    const moveEvent = dispatchTouch(touchTarget, 'touchmove', { x: 20, y: 300 });

    expect(result.current.status).toBe('idle');
    expect(moveEvent.defaultPrevented).toBe(false);
  });

  it('touchcancel 이면 onRefresh 를 호출하지 않고 idle 로 돌아간다', () => {
    const onRefresh = vi.fn(() => Promise.resolve());
    const { touchTarget, result } = setup(onRefresh);

    pull(touchTarget, 300);
    dispatchTouch(touchTarget, 'touchcancel');

    expect(onRefresh).not.toHaveBeenCalled();
    expect(result.current.status).toBe('idle');
  });
});
