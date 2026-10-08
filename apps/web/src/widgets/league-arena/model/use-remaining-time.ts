import { useEffect, useState } from 'react';

import { getNextMonday, getRemainingTime } from '@/shared/lib/date';

/** 다음 월요일 0시까지 남은 시간을 매초 갱신한다. */
export function useRemainingTime(): string {
  const [remaining, setRemaining] = useState('00시간 00분 00초');

  useEffect(() => {
    const seasonEnd = getNextMonday().getTime();
    const update = () => setRemaining(getRemainingTime(seasonEnd));

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return remaining;
}
