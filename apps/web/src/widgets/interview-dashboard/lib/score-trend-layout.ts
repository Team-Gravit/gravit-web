// 점수 추이의 세로 축. 그리드 세 줄이 0 · 50 · 100점에 놓인다.
const MAX_SCORE = 100;

/**
 * 점수 추이 점의 가로 위치(0~1). 시안 DATA1~4의 배치를 따른다.
 * 1개는 가운데, 2개는 1/4 · 3/4, 3개부터는 양 끝을 포함해 균등하게 놓는다.
 */
export function getTrendXRatios(count: number): number[] {
  if (count === 1) {
    return [0.5];
  }
  if (count === 2) {
    return [0.25, 0.75];
  }
  return Array.from({ length: count }, (_, index) => index / (count - 1));
}

/** 점수의 세로 위치(0=아래, 1=위). 범위를 벗어난 점수는 축 안으로 자른다. */
export function getTrendYRatio(score: number): number {
  return Math.min(Math.max(score / MAX_SCORE, 0), 1);
}
