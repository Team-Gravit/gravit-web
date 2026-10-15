/**
 * 손가락 이동을 콘텐츠 이동 거리로 바꾼다. 많이 당길수록 증가 폭이 줄어든다.
 *
 * @param maxDistance 콘텐츠 이동 거리의 상한. 양수여야 한다.
 * @param elasticity 양수이며, 값이 클수록 콘텐츠가 손가락을 더 많이 따라간다.
 * @returns 손가락 이동 거리가 0 이하이면 0, 그 외에는 maxDistance보다 작은 거리.
 */
export function applyRubberband(
  fingerDistance: number,
  maxDistance: number,
  elasticity: number,
): number {
  if (fingerDistance <= 0) {
    return 0;
  }

  return (fingerDistance * maxDistance * elasticity) / (maxDistance + elasticity * fingerDistance);
}

const SCROLLABLE_OVERFLOW_VALUES = new Set(['auto', 'scroll']);

/**
 * 터치한 요소부터 boundary까지 손가락으로 위로 스크롤할 수 있는 영역을 찾는다.
 *
 * @param boundary 탐색에 포함되는 마지막 조상. target은 그 자손이거나 자기 자신이어야 한다.
 * @returns 먼저 스크롤할 영역이 있으면 true, 없으면 false.
 */
export function canScrollUpWithin(target: Element, boundary: Element): boolean {
  let element: Element | null = target;

  while (element) {
    // scrollTop이 있어도 overflow: hidden이면 손가락으로 스크롤할 수 없다.
    if (
      element.scrollTop > 0 &&
      SCROLLABLE_OVERFLOW_VALUES.has(getComputedStyle(element).overflowY)
    ) {
      return true;
    }
    if (element === boundary) {
      return false;
    }
    element = element.parentElement;
  }

  return false;
}

export type PullDirection = 'undecided' | 'pull' | 'ignore';

/**
 * 터치 시작점에서 움직인 방향으로 당겨서 새로고침 제스처인지 결정한다.
 *
 * @param lockDistance 방향을 확정하기 전에 필요한 최소 이동 거리.
 * @returns 두 축 모두 기준 미만이면 'undecided', 아래쪽 이동이 가로 이동 이상이면 'pull',
 * 가로 이동이 더 크거나 위로 움직였으면 'ignore'.
 */
export function resolvePullDirection(
  deltaX: number,
  deltaY: number,
  lockDistance: number,
): PullDirection {
  if (Math.abs(deltaX) < lockDistance && Math.abs(deltaY) < lockDistance) {
    return 'undecided';
  }
  if (Math.abs(deltaX) > Math.abs(deltaY) || deltaY < 0) {
    return 'ignore';
  }

  return 'pull';
}
