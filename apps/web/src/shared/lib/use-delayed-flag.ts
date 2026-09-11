import { useEffect, useState } from 'react';

/**
 * `active`가 `delayMs` 이상 연속으로 참일 때만 true를 반환한다.
 *
 * 로딩 스켈레톤에 쓴다 — 응답이 임계점보다 빨리 오면 스켈레톤을 아예 띄우지 않아
 * 짧게 깜빡이는 현상을 막는다.
 */
export function useDelayedFlag(active: boolean, delayMs = 300): boolean {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => setReached(true), delayMs);
    // active가 꺼지거나 delayMs가 바뀌면 타이머 취소 + 플래그 리셋(다음 로딩에서 다시 지연 적용).
    return () => {
      clearTimeout(timer);
      setReached(false);
    };
  }, [active, delayMs]);

  return reached;
}
