import { describe, expect, it } from 'vitest';

import { formatLeagueTier, formatShortLeagueTier } from './format-league-tier';

describe('formatLeagueTier', () => {
  it('티어명 뒤 숫자를 로마자로 바꾼다', () => {
    expect(formatLeagueTier('브론즈 3')).toBe('브론즈 III');
    expect(formatLeagueTier('실버 1')).toBe('실버 I');
  });

  it('숫자가 없으면 원문을 그대로 반환한다', () => {
    expect(formatLeagueTier('언랭')).toBe('언랭');
  });
});

describe('formatShortLeagueTier', () => {
  it('티어명을 약어 + 숫자로 축약한다', () => {
    expect(formatShortLeagueTier('브론즈 3')).toBe('B3');
    expect(formatShortLeagueTier('실버 1')).toBe('S1');
    expect(formatShortLeagueTier('다이아몬드 5')).toBe('D5');
  });

  it('매핑에 없는 티어명은 원문을 유지한다', () => {
    expect(formatShortLeagueTier('마스터 1')).toBe('마스터1');
  });
});
