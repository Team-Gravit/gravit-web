import { describe, expect, it } from 'vitest';

import { getPaginationRange } from './get-pagination-range';

describe('getPaginationRange', () => {
  it('전체가 표시 가능하면 생략 없이 모든 페이지를 반환한다', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 5 })).toEqual([1, 2, 3, 4, 5]);
  });

  it('현재 페이지가 앞쪽이면 앞은 펼치고 뒤만 접는다', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 99 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      99,
    ]);
  });

  it('현재 페이지가 중간이면 양쪽을 모두 접는다', () => {
    expect(getPaginationRange({ currentPage: 50, totalPages: 99 })).toEqual([
      1,
      'ellipsis',
      49,
      50,
      51,
      'ellipsis',
      99,
    ]);
  });

  it('현재 페이지가 끝쪽이면 앞만 접고 뒤는 펼친다', () => {
    expect(getPaginationRange({ currentPage: 99, totalPages: 99 })).toEqual([
      1,
      'ellipsis',
      95,
      96,
      97,
      98,
      99,
    ]);
  });

  it('siblingCount를 늘리면 현재 페이지 주변을 더 넓게 보여준다', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 99, siblingCount: 2 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      'ellipsis',
      99,
    ]);
  });

  it('totalPages가 1이면 [1]을 반환한다', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 1 })).toEqual([1]);
  });

  it('totalPages가 0이면 빈 배열을 반환한다', () => {
    expect(getPaginationRange({ currentPage: 1, totalPages: 0 })).toEqual([]);
  });
});
