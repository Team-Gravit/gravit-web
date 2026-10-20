import { describe, expect, it } from 'vitest';

import {
  formatSessionSummary,
  getAccuracyLevel,
  getRecentAverageScore,
} from './interview-dashboard';

describe('getRecentAverageScore', () => {
  it('완료 세션이 없으면 recentAverageScore 가 0 이어도 null 을 반환한다', () => {
    expect(getRecentAverageScore({ completedSessionCount: 0, recentAverageScore: 0 })).toBeNull();
  });

  it('완료 세션이 있으면 0점도 그대로 반환한다', () => {
    expect(getRecentAverageScore({ completedSessionCount: 1, recentAverageScore: 0 })).toBe(0);
  });

  it('완료 세션이 있으면 recentAverageScore 를 반환한다', () => {
    expect(getRecentAverageScore({ completedSessionCount: 12, recentAverageScore: 68 })).toBe(68);
  });
});

describe('getAccuracyLevel', () => {
  it.each([
    [0, 'low'],
    [49.9, 'low'],
    [50, 'medium'],
    [79.9, 'medium'],
    [80, 'high'],
    [100, 'high'],
  ] as const)('%s 이면 %s 다', (accuracyRate, level) => {
    expect(getAccuracyLevel(accuracyRate)).toBe(level);
  });
});

describe('formatSessionSummary', () => {
  const dataStructure = { topic: 'DATA_STRUCTURE', displayName: '자료구조' } as const;
  const algorithm = { topic: 'ALGORITHM', displayName: '알고리즘' } as const;
  const network = { topic: 'NETWORK', displayName: '네트워크' } as const;

  it('주제가 하나면 「외 n개」 없이 주제와 날짜를 보여준다', () => {
    expect(
      formatSessionSummary({ topics: [dataStructure], startedAt: '2026-07-28T10:00:00' }),
    ).toBe('자료구조 · 7월 28일');
  });

  it('주제가 여럿이면 첫 주제 뒤에 나머지 개수를 붙인다', () => {
    expect(
      formatSessionSummary({
        topics: [dataStructure, algorithm, network],
        startedAt: '2026-09-05T23:59:00',
      }),
    ).toBe('자료구조 외 2개 · 9월 5일');
  });

  it('주제가 없으면 날짜만 보여준다', () => {
    expect(formatSessionSummary({ topics: [], startedAt: '2026-10-01T00:00:00' })).toBe('10월 1일');
  });
});
