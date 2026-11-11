import { describe, expect, it } from 'vitest';

import { getAnchorPage } from './anchor';

describe('getAnchorPage', () => {
  // 페이지 경계. off-by-one 이 가장 흔한 버그라 경계를 전부 고정한다 (size 10).
  it.each([
    [1, 0],
    [10, 0],
    [11, 1],
    [20, 1],
    [91, 9],
    [92, 9],
    [100, 9],
    [101, 10],
    [124, 12],
  ])('%i등이면 %i번 페이지다', (rank, page) => {
    expect(getAnchorPage(rank)).toBe(page);
  });

  it('rank 가 0 이하여도 0 페이지로 수렴한다', () => {
    expect(getAnchorPage(0)).toBe(0);
    expect(getAnchorPage(-5)).toBe(0);
  });
});
