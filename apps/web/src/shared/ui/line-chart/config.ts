export interface ChartConfig {
  width: number;
  height: number;
  padding: { left: number; right: number; top: number; bottom: number };
  /** Y축 라벨을 축선에서 왼쪽으로 띄우는 거리 */
  yAxisLabelOffset: number;
  yAxisLineOverFlow: number;
}

// viewBox 치수. 모바일·데스크톱이 완전히 달라 미디어쿼리 클래스가 아니라 값으로 분기한다.
export const DESKTOP_CHART_CONFIG: ChartConfig = {
  width: 1100,
  height: 300,
  padding: { left: 86, right: 20, top: 34, bottom: 58 },
  yAxisLabelOffset: 55,
  yAxisLineOverFlow: 24,
};

export const MOBILE_CHART_CONFIG: ChartConfig = {
  width: 375,
  height: 200,
  padding: { left: 35, right: 20, top: 30, bottom: 20 },
  yAxisLabelOffset: 17,
  yAxisLineOverFlow: 10,
};
