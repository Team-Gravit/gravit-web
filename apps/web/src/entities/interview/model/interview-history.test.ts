import { describe, expect, it } from 'vitest';

import { formatSessionDate, formatSessionHistoryDetail } from './interview-history';

describe('formatSessionDate', () => {
  it('long 이면 「2026년 7월 8일」로 월·일 앞의 0을 뺀다', () => {
    expect(formatSessionDate('2026-07-08T10:00:00', 'long')).toBe('2026년 7월 8일');
  });

  it('dotted 이면 「2026. 07. 08」로 0을 채운다', () => {
    expect(formatSessionDate('2026-07-08T10:00:00', 'dotted')).toBe('2026. 07. 08');
  });

  it('compact 이면 「2026.07.08」로 붙여 쓴다', () => {
    expect(formatSessionDate('2026-07-08T10:00:00', 'compact')).toBe('2026.07.08');
  });

  it('자정 직전 시각도 서버 날짜를 그대로 쓴다', () => {
    expect(formatSessionDate('2026-07-28T23:59:59', 'long')).toBe('2026년 7월 28일');
  });
});

describe('formatSessionHistoryDetail', () => {
  const dataStructure = { topic: 'DATA_STRUCTURE', displayName: '자료구조' } as const;
  const algorithm = { topic: 'ALGORITHM', displayName: '알고리즘' } as const;

  it('주제를 모두 나열하고 날짜를 붙인다', () => {
    expect(
      formatSessionHistoryDetail(
        { topics: [dataStructure, algorithm], startedAt: '2026-07-28T10:00:00' },
        'long',
      ),
    ).toBe('자료구조 · 알고리즘 · 2026년 7월 28일');
  });

  it('주제가 없으면 날짜만 보여준다', () => {
    expect(
      formatSessionHistoryDetail({ topics: [], startedAt: '2026-09-10T10:00:00' }, 'dotted'),
    ).toBe('2026. 09. 10');
  });
});
