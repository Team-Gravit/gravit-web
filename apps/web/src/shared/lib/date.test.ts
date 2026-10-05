import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatElapsedTime, formatISODate, getRemainingTime } from './date';

afterEach(() => {
  vi.useRealTimers();
});

describe('formatElapsedTime', () => {
  it('7을 넘기면 00:07을 반환한다', () => {
    expect(formatElapsedTime(7)).toBe('00:07');
  });

  it('65를 넘기면 01:05를 반환한다', () => {
    expect(formatElapsedTime(65)).toBe('01:05');
  });

  it('196을 넘기면 03:16을 반환한다', () => {
    expect(formatElapsedTime(196)).toBe('03:16');
  });

  it('음수를 넘기면 00:00을 반환한다', () => {
    expect(formatElapsedTime(-1)).toBe('00:00');
  });
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

describe('formatISODate', () => {
  it('ISO 날짜의 날짜 부분만 마침표로 이어 붙인다', () => {
    expect(formatISODate('2026-06-21T12:30:00Z')).toBe('2026.06.21');
  });

  it('시간 정보가 없어도 동작한다', () => {
    expect(formatISODate('2026-06-21')).toBe('2026.06.21');
  });
});
