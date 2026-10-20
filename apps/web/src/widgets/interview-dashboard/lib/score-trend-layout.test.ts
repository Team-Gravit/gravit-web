import { describe, expect, it } from 'vitest';

import { getTrendXRatios, getTrendYRatio } from './score-trend-layout';

describe('getTrendXRatios', () => {
  it('1개면 가운데에 놓는다', () => {
    expect(getTrendXRatios(1)).toEqual([0.5]);
  });

  it('2개면 1/4 과 3/4 에 놓는다', () => {
    expect(getTrendXRatios(2)).toEqual([0.25, 0.75]);
  });

  it('3개면 양 끝과 가운데에 놓는다', () => {
    expect(getTrendXRatios(3)).toEqual([0, 0.5, 1]);
  });

  it('5개면 양 끝을 포함해 균등하게 놓는다', () => {
    expect(getTrendXRatios(5)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });
});

describe('getTrendYRatio', () => {
  it('100점 만점 기준 비율을 반환한다', () => {
    expect(getTrendYRatio(68)).toBe(0.68);
  });

  it('범위를 벗어난 점수는 0~1 로 자른다', () => {
    expect(getTrendYRatio(-5)).toBe(0);
    expect(getTrendYRatio(120)).toBe(1);
  });
});
