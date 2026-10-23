import { describe, expect, it } from 'vitest';

import { compareWithAverage, formatAnswerTitle, getScoreSegments } from './interview-report';

describe('compareWithAverage', () => {
  it('평균보다 높으면 차이와 함께 「높아요」를 반환한다', () => {
    expect(compareWithAverage(48, 28)).toEqual({
      comparison: 'higher',
      message: '평균보다 20점 높아요',
    });
  });

  it('평균보다 낮으면 차이와 함께 「낮아요」를 반환한다', () => {
    expect(compareWithAverage(20, 22)).toEqual({
      comparison: 'lower',
      message: '평균보다 2점 낮아요',
    });
  });

  it('평균과 같으면 same 을 반환한다', () => {
    expect(compareWithAverage(30, 30)).toEqual({ comparison: 'same', message: '평균과 같아요' });
  });
});

describe('getScoreSegments', () => {
  it('만점 14 는 5 · 10 · 14 로 나눈다', () => {
    expect(getScoreSegments(14, 14).map((segment) => segment.threshold)).toEqual([5, 10, 14]);
  });

  it('만점 3 은 1 · 2 · 3 으로 나눈다', () => {
    expect(getScoreSegments(3, 3).map((segment) => segment.threshold)).toEqual([1, 2, 3]);
  });

  it('앞 칸부터 채우고 걸친 칸은 비율만큼 채운다', () => {
    expect(getScoreSegments(7, 14).map((segment) => segment.fillRatio)).toEqual([1, 0.4, 0]);
  });

  it('0점이면 모두 비운다', () => {
    expect(getScoreSegments(0, 3).map((segment) => segment.fillRatio)).toEqual([0, 0, 0]);
  });
});

describe('formatAnswerTitle', () => {
  it('「순서. 주제」로 보여준다', () => {
    expect(
      formatAnswerTitle({
        displayOrder: 1,
        topic: { topic: 'ALGORITHM', displayName: '알고리즘' },
      }),
    ).toBe('1. 알고리즘');
  });
});
