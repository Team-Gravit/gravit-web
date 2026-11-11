import { LEAGUE_PAGE_SIZE } from './constants';

/**
 * 내 등수(1-based)가 속한 0-based 페이지 번호를 구한다.
 * 페이지 n은 등수 `10n+1 ~ 10n+10`을 담는다(size 10 기준).
 *
 * @example getAnchorPage(1) === 0, getAnchorPage(11) === 1, getAnchorPage(92) === 9
 */
export function getAnchorPage(rank: number): number {
  // 서버가 1~N을 보장하지만 rank<=0 같은 비정상 입력도 0페이지로 수렴시킨다.
  return Math.max(0, Math.floor((rank - 1) / LEAGUE_PAGE_SIZE));
}
