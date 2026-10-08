import { useEffect, useState } from 'react';

/**
 * 처음 마운트된 뒤 `durationMs` 동안은 `true`를 유지한다.
 * 시간이 지나면 `isActive`를 그대로 반환하며, 이후 활성화에는 대기 시간을 다시 적용하지 않는다.
 */
export function useInitialMinimumDuration(isActive: boolean, durationMs: number): boolean {
  const [hasMinimumDurationElapsed, setHasMinimumDurationElapsed] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => setHasMinimumDurationElapsed(true), durationMs);

    return () => window.clearTimeout(timerId);
  }, [durationMs]);

  return isActive || !hasMinimumDurationElapsed;
}
