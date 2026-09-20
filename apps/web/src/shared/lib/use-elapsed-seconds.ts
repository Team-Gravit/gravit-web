import { useEffect, useState } from 'react';

/**
 * 마운트 시점부터 흐른 초를 1초마다 갱신해 돌려주는 훅
 *
 * - 매초 리렌더가 일어나므로 **표시하는 컴포넌트 안에서만** 호출
 */
export function useElapsedSeconds(): number {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    // setInterval 은 호출 간격이 최소 1초 보장이므로 틱마다 시작 시각과의 차이를 다시 계산
    // 누적 오차가 쌓이는 걸 방지하기 위함
    const timerId = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return elapsedSeconds;
}
