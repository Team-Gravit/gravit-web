import { describe, expect, it } from 'vitest';

import {
  FIRST_PROFILE_COLOR_NUMBER,
  LAST_PROFILE_COLOR_NUMBER,
  PROFILE_COLORS,
  getNextProfileColorNumber,
  getPreviousProfileColorNumber,
  getProfileColor,
} from './profile-colors';

describe('profile-colors', () => {
  it('색은 19가지이고 번호는 1부터 시작한다', () => {
    expect(LAST_PROFILE_COLOR_NUMBER).toBe(19);
    expect(FIRST_PROFILE_COLOR_NUMBER).toBe(1);
    expect(PROFILE_COLORS[1]).toBe('#EB1D64');
  });

  describe('getNextProfileColorNumber', () => {
    it('다음 번호를 돌려준다', () => {
      expect(getNextProfileColorNumber(1)).toBe(2);
    });

    it('마지막에서 다음을 누르면 처음으로 돌아간다', () => {
      expect(getNextProfileColorNumber(19)).toBe(1);
    });
  });

  describe('getPreviousProfileColorNumber', () => {
    it('이전 번호를 돌려준다', () => {
      expect(getPreviousProfileColorNumber(2)).toBe(1);
    });

    it('처음에서 이전을 누르면 마지막으로 돌아간다', () => {
      expect(getPreviousProfileColorNumber(1)).toBe(19);
    });
  });

  describe('getProfileColor', () => {
    it('번호에 해당하는 색을 돌려준다', () => {
      expect(getProfileColor(19)).toBe('#8138C5');
    });

    it.each([0, 20, -1, 1.5])('범위 밖 %s 는 첫 색으로 돌린다', (colorNumber) => {
      expect(getProfileColor(colorNumber)).toBe(PROFILE_COLORS[1]);
    });
  });
});
