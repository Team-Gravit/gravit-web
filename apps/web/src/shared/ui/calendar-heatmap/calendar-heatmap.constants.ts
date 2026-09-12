/**
 * 히트맵 5단계 색. 학습량이 많을수록 진해진다.
 * 첫 단계(학습 없음)는 시안 기준 gray-300(#dcdcdc)이다.
 */
export const HEATMAP_COLOR_LEVELS = [
  'bg-gray-300',
  'bg-purple-200',
  'bg-purple-300',
  'bg-purple-500',
  'bg-purple-700',
] as const;
