import type { ChartConfig } from './config';

export interface LineChartPoint {
  key: string;
  /** 0-based 순서 인덱스. 균등 간격으로 X에 매핑된다. */
  x: number;
  /** 세로 값. yMin~yMax 범위로 스케일된다. */
  y: number;
  /** 포인트를 강조한다(예: 현재). */
  highlight?: boolean;
}

interface ChartGeometryParams<T extends LineChartPoint> {
  points: T[];
  config: ChartConfig;
  yMin: number;
  yMax: number;
}

/** 데이터 포인트를 viewBox 좌표로 변환하고 라인·영역 path를 만든다. 도메인 무관 순수 계산. */
export function getChartGeometry<T extends LineChartPoint>({
  points,
  config,
  yMin,
  yMax,
}: ChartGeometryParams<T>) {
  const plotWidth = config.width - config.padding.left - config.padding.right;
  const plotHeight = config.height - config.padding.top - config.padding.bottom;
  const plotBottomY = config.height - config.padding.bottom;

  const getX = (index: number) => {
    const total = points.length - 1;
    if (total <= 0) return config.padding.left;
    return config.padding.left + (plotWidth / total) * index;
  };

  const getY = (value: number) => {
    if (yMax === yMin) return plotBottomY;
    return config.padding.top + ((yMax - value) / (yMax - yMin)) * plotHeight;
  };

  const positioned = points.map((point) => ({
    ...point,
    px: getX(point.x),
    py: getY(point.y),
  }));

  const linePath = positioned
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.px} ${point.py}`)
    .join(' ');

  const areaPath = positioned.length
    ? `${linePath} L ${positioned[positioned.length - 1].px} ${plotBottomY} L ${positioned[0].px} ${plotBottomY} Z`
    : '';

  return { positioned, getX, getY, linePath, areaPath, plotBottomY };
}
