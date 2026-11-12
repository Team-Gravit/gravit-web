import { type RefObject, useEffect, useEffectEvent, useRef, useState } from 'react';

import {
  applyRubberband,
  canScrollUpWithin,
  type PullDirection,
  resolvePullDirection,
} from './pull-gesture';

// 실기기에서 확인하기 전까지 FEAT-058 데모 수치를 쓴다.
export const PULL_THRESHOLD_PX = 72;
const MAX_PULL_DISTANCE_PX = 260;
const PULL_ELASTICITY = 0.55;
const DIRECTION_LOCK_DISTANCE_PX = 6;
// 응답이 빨라도 로고가 깜빡이고 사라지지 않게 한다.
const MIN_REFRESH_DURATION_MS = 600;

export type PullStatus = 'idle' | 'pulling' | 'canRelease' | 'refreshing';

export interface PullState {
  status: PullStatus;
  /** 콘텐츠를 아래로 옮길 거리(px). 고무줄 저항이 적용된 값이다. */
  distance: number;
}

interface TouchGesture {
  startX: number;
  startY: number;
  direction: PullDirection;
  distance: number;
}

interface UsePullToRefreshOptions {
  containerRef: RefObject<HTMLElement | null>;
  onRefresh: () => Promise<unknown>;
  onRefreshError: (error: unknown) => void;
}

const IDLE_STATE: PullState = { status: 'idle', distance: 0 };

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * 컨테이너를 아래로 당기는 터치를 추적해 새로고침 상태를 돌려준다.
 * 안쪽 스크롤이 남아 있거나 새로고침 중이면 당김을 받지 않는다.
 * onRefresh 실패는 onRefreshError에 전달하고 최소 표시 시간이 지난 뒤 idle로 돌아간다.
 *
 * @returns 현재 단계와 콘텐츠를 아래로 옮길 거리.
 */
export function usePullToRefresh({
  containerRef,
  onRefresh,
  onRefreshError,
}: UsePullToRefreshOptions): PullState {
  const [pullState, setPullState] = useState<PullState>(IDLE_STATE);
  const isRefreshingRef = useRef(false);
  const gestureRef = useRef<TouchGesture | null>(null);

  const runRefresh = useEffectEvent(async () => {
    isRefreshingRef.current = true;
    setPullState({ status: 'refreshing', distance: PULL_THRESHOLD_PX });
    const minimumDurationPromise = wait(MIN_REFRESH_DURATION_MS);

    try {
      await onRefresh();
    } catch (error) {
      onRefreshError(error);
    } finally {
      await minimumDurationPromise;
      isRefreshingRef.current = false;
      setPullState(IDLE_STATE);
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // 손가락으로 터치한 경우 호출할 함수
    function handleTouchStart(event: TouchEvent) {
      gestureRef.current = null;

      // 이미 새로고침 중이거나 손가락이 한 개가 아닌 경우
      if (isRefreshingRef.current || event.touches.length !== 1) {
        return;
      }
      // 앱 셸 스크롤 영역은 container 바깥에 있으므로 문서 루트까지 확인
      if (
        event.target instanceof Element &&
        canScrollUpWithin(event.target, document.documentElement)
      ) {
        return;
      }

      // 시작 좌표와 방향 초기값(정해지지 않음) 저장
      const touch = event.touches[0];
      gestureRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        direction: 'undecided',
        distance: 0,
      };
    }

    // 손가락을 움직이는 경우 호출할 함수
    function handleTouchMove(event: TouchEvent) {
      const gesture = gestureRef.current;
      if (!gesture || gesture.direction === 'ignore') {
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - gesture.startX;
      const deltaY = touch.clientY - gesture.startY;

      // 방향이 결정되지 않은 경우 판정
      if (gesture.direction === 'undecided') {
        gesture.direction = resolvePullDirection(deltaX, deltaY, DIRECTION_LOCK_DISTANCE_PX);
        if (gesture.direction !== 'pull') {
          return;
        }
      }

      // 'pull' 동작인 경우 아래 코드 실행
      // 당기는 동안 브라우저 스크롤과 고무줄 튕김이 함께 일어나지 않게 방지
      if (event.cancelable) {
        event.preventDefault();
      }

      gesture.distance = applyRubberband(deltaY, MAX_PULL_DISTANCE_PX, PULL_ELASTICITY);
      setPullState({
        status: gesture.distance >= PULL_THRESHOLD_PX ? 'canRelease' : 'pulling',
        distance: gesture.distance,
      });
    }

    // 손가락을 떼는 경우 호출할 함수
    function handleTouchEnd() {
      const releasedGesture = gestureRef.current;
      gestureRef.current = null;

      // 'pull' 제스처가 아니면 얼리 리턴
      if (releasedGesture?.direction !== 'pull') {
        return;
      }

      // 당김 거리가 기준보다 짧은 경우 원래 상태로 되돌림
      if (releasedGesture.distance < PULL_THRESHOLD_PX) {
        setPullState(IDLE_STATE);
        return;
      }
      void runRefresh();
    }

    // 터치가 취소된 경우 호출할 함수
    function handleTouchCancel() {
      const canceledGesture = gestureRef.current;
      gestureRef.current = null;
      if (canceledGesture?.direction === 'pull') {
        setPullState(IDLE_STATE);
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    // preventDefault가 동작하려면 passive가 아니어야 한다. React의 onTouchMove는 passive로 등록된다.
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [containerRef]);

  return pullState;
}
