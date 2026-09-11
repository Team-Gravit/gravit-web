import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRemainingTime } from './date';

afterEach(() => {
  vi.useRealTimers();
});

describe('getRemainingTime', () => {
  it('목표 시각이 이미 지났으면 00시간 00분 00초를 반환한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:10Z'));

    expect(getRemainingTime(new Date('2026-01-01T00:00:00Z').getTime())).toBe('00시간 00분 00초');
  });

  it('남은 시간을 HH시간 MM분 SS초로 0 채워 반환한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const target = new Date('2026-01-01T01:02:03Z').getTime();
    expect(getRemainingTime(target)).toBe('01시간 02분 03초');
  });
});
