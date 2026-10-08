import { useEffect, useState } from 'react';

/** 기준 시각부터 경과한 초를 1초마다 갱신한다. */
export function useElapsedSeconds(startedAt: number): number {
  const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());

  useEffect(() => {
    // 현재 시각과 다시 비교해 interval 지연이 누적되지 않게 한다.
    const timerId = window.setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return Math.max(Math.floor((currentTimeMs - startedAt) / 1000), 0);
}
