/**
 * 프로필 아바타의 배경색
 * - 키는 서버의 `profilePhotoNumber` 와 같은 1~19 번호다.
 */
export const PROFILE_COLORS: Record<number, string> = {
  1: '#EB1D64',
  2: '#F44334',
  3: '#FFEA3F',
  4: '#4CAE51',
  5: '#53A8EB',
  6: '#3F50B5',
  7: '#9D27B0',
  8: '#673AB7',
  9: '#808081',
  10: '#000000',
  11: '#FF9900',
  12: '#FE9370',
  13: '#FBC6DC',
  14: '#A4ECAD',
  15: '#6DD6C4',
  16: '#2989C3',
  17: '#1430E5',
  18: '#340D91',
  19: '#8138C5',
};

/** 처음 선택되는 색상 번호. */
export const FIRST_PROFILE_COLOR_NUMBER = 1;

/** 팔레트의 마지막 색상 번호. */
export const LAST_PROFILE_COLOR_NUMBER = Object.keys(PROFILE_COLORS).length;

function isProfileColorNumber(colorNumber: number): boolean {
  return Number.isInteger(colorNumber) && colorNumber in PROFILE_COLORS;
}

/** 색상 번호에 해당하는 색을 반환한다. */
export function getProfileColor(colorNumber: number): string {
  if (!isProfileColorNumber(colorNumber)) {
    return PROFILE_COLORS[FIRST_PROFILE_COLOR_NUMBER];
  }

  return PROFILE_COLORS[colorNumber];
}

/** 다음 색상 번호를 반환한다. */
export function getNextProfileColorNumber(colorNumber: number): number {
  if (!isProfileColorNumber(colorNumber) || colorNumber === LAST_PROFILE_COLOR_NUMBER) {
    return FIRST_PROFILE_COLOR_NUMBER;
  }

  return colorNumber + 1;
}

/** 이전 색상 번호를 반환한다. */
export function getPreviousProfileColorNumber(colorNumber: number): number {
  if (!isProfileColorNumber(colorNumber) || colorNumber === FIRST_PROFILE_COLOR_NUMBER) {
    return LAST_PROFILE_COLOR_NUMBER;
  }

  return colorNumber - 1;
}
