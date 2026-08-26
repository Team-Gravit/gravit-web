import type { SeasonHistoryEntry } from '@/shared/api/@generated/model';

import type { ChartConfig } from './chart-config';

interface UseLeagueChartDataProps {
  seasonHistory: SeasonHistoryEntry[];
  chartConfig: ChartConfig;
}

export const getLeagueChartData = ({ seasonHistory, chartConfig }: UseLeagueChartDataProps) => {
  const PLOT_WIDTH = chartConfig.width - chartConfig.padding.left - chartConfig.padding.right;
  const PLOT_HEIGHT = chartConfig.height - chartConfig.padding.top - chartConfig.padding.bottom;

  const yAxis = Array.from(
    new Map(
      seasonHistory.map((item) => [
        item.sortOrder,
        {
          sortOrder: item.sortOrder,
          leagueName: item.leagueName,
        },
      ]),
    ).values(),
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  const maxY = Math.max(yAxis.length, 1);
  const minY = 1;

  const getY = (value: number) => {
    if (maxY === minY) {
      return chartConfig.height - chartConfig.padding.bottom;
    }

    return chartConfig.padding.top + ((maxY - value) / (maxY - minY)) * PLOT_HEIGHT;
  };

  const getX = (index: number) => {
    const total = seasonHistory.length - 1;

    if (total <= 0) return chartConfig.padding.left;

    return chartConfig.padding.left + (PLOT_WIDTH / total) * index;
  };

  const sortOrderToAxisValue = new Map(yAxis.map((axis, index) => [axis.sortOrder, index + 1]));

  const chartPoints = seasonHistory.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(sortOrderToAxisValue.get(point.sortOrder) ?? minY),
  }));

  // svg path 요소
  const linePath = chartPoints
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';

      return `${command} ${point.x} ${point.y}`;
    })
    .join(' ');

  const plotBottomY = chartConfig.height - chartConfig.padding.bottom;

  const areaPath = `
        ${linePath}
        L ${chartPoints[chartPoints.length - 1].x} ${plotBottomY}
        L ${chartPoints[0].x} ${plotBottomY}
        Z
    `;

  return {
    chartPoints,
    getX,
    getY,
    sortOrderToAxisValue,
    yAxis,
    minY,
    maxY,
    areaPath,
    linePath,
  };
};
