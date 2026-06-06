import { useId, useRef, useState } from 'react';

import Diamond from '@/shared/assets/icons/tiers/Diamond1.svg?react';
import useResponsive from '@/shared/model/use-responsive';

const ChartMockData = {
  summary: {
    currentRank: 12,
    top3Count: 14,
    highestTier: {
      code: 'SILVER_1',
      label: '실버 I',
    },
  },
  chart: {
    yAxis: [
      { value: 1, label: 'D1' },
      { value: 2, label: 'P2' },
      { value: 3, label: 'G3' },
    ],
    points: [
      {
        season: 'S1',
        label: 'S1',
        value: 3,
        tier: 'BRONZE_3',
        tierLabel: '브론즈 III',
      },
      {
        season: 'S2',
        label: 'S2',
        value: 1,
        tier: 'SILVER_1',
        tierLabel: '실버 I',
      },
      {
        season: 'S3',
        label: 'S3',
        value: 2,
        tier: 'SILVER_2',
        tierLabel: '실버 II',
      },
      {
        season: 'S4',
        label: 'S4',
        value: 2,
        tier: 'SILVER_2',
        tierLabel: '실버 II',
      },
      {
        season: 'CURRENT',
        label: '현재',
        value: 1,
        tier: 'BRONZE_3',
        tierLabel: '브론즈 III',
      },
    ],
  },
};

const desktopChartConfig = {
  width: 1100,
  height: 280,
  padding: {
    left: 86,
    right: 20,
    top: 24,
    bottom: 48,
  },
  yAxisLabelOffset: 55,
  yAxisLineOverFlow: 24,
};

const mobileChartConfig = {
  width: 375,
  height: 160,
  padding: {
    left: 35,
    right: 20,
    top: 24,
    bottom: 24,
  },
  yAxisLabelOffset: 17,
  yAxisLineOverFlow: 10,
};

function LeagueHistoryChart() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [activePoint, setActivePoint] = useState<string | null>(null);
  const gradientId = useId();
  const { isMobile } = useResponsive();

  //  svg viewBox 반응형 분기처리
  const chartConfig = isMobile ? mobileChartConfig : desktopChartConfig;

  // 실제 차트가 그려지는 범위
  const PLOT_WIDTH = chartConfig.width - chartConfig.padding.left - chartConfig.padding.right;
  const PLOT_HEIGHT = chartConfig.height - chartConfig.padding.top - chartConfig.padding.bottom;

  const getX = (index: number) => {
    const total = ChartMockData.chart.points.length - 1;

    if (total <= 0) return chartConfig.padding.left;

    return chartConfig.padding.left + (PLOT_WIDTH / total) * index;
  };

  const yAxisValues = ChartMockData.chart.yAxis.map((item) => item.value);
  const maxY = Math.max(...yAxisValues);
  const minY = Math.min(...yAxisValues);

  const getY = (value: number) => {
    return chartConfig.padding.top + ((value - minY) / (maxY - minY)) * PLOT_HEIGHT;
  };

  const chartPoints = ChartMockData.chart.points.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(point.value),
  }));

  const activeChartPoint = chartPoints.find((point) => point.season === activePoint);

  const activePointIndex = chartPoints.findIndex((point) => point.season === activePoint);

  const isLastPoint = activePointIndex === chartPoints.length - 1;

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

  const getTooltipPosition = (point: { x: number; y: number }) => {
    const svgBox = svgRef.current?.getBoundingClientRect();
    if (!svgBox) return { left: 0, top: 0 };

    return {
      left: (point.x / chartConfig.width) * svgBox.width,
      top: (point.y / chartConfig.height) * svgBox.height,
    };
  };

  return (
    <div className="w-full relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
        className="w-full h-full"
        style={{
          overflow: 'visible',
        }}
        preserveAspectRatio="none"
      >
        <title className="invisible">리그 히스토리 차트</title>

        {/* Y축 라벨 */}
        {ChartMockData.chart.yAxis.map((axis) => {
          const y = getY(axis.value);

          return (
            <g key={axis.value}>
              <text
                x={chartConfig.padding.left - chartConfig.yAxisLabelOffset}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="caption1 md:heading2"
                fill="#646464"
              >
                {axis.label}
              </text>

              <line
                x1={chartConfig.padding.left - chartConfig.yAxisLineOverFlow}
                x2={chartConfig.width - chartConfig.padding.right + chartConfig.yAxisLineOverFlow}
                y1={y}
                y2={y}
                stroke="#DCDCDC"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* X축 라벨 */}
        {ChartMockData.chart.points.map((point, index) => (
          <text
            key={`${point.season}-label`}
            x={getX(index)}
            y={chartConfig.height - 2}
            textAnchor="middle"
            className=" caption1 md:heading2"
            fill="#646464"
          >
            {point.label}
          </text>
        ))}

        {/* Background 그라데이션 요소 */}
        <path d={areaPath} fill={`url(#${gradientId}-area)`} />

        {/* Line 요소 */}
        <path d={linePath} fill="none" stroke={`url(#${gradientId}-line)`} strokeWidth={2} />

        {chartPoints.map((point) => (
          <g
            key={point.season}
            onPointerEnter={() => setActivePoint(point.season)}
            onPointerLeave={() => {
              if (isMobile) return;
              setActivePoint(null);
            }}
            className="relative"
          >
            {/* 호버링 전용 stroke circle 요소 */}
            <circle
              cx={point.x}
              cy={point.y}
              r={isMobile ? 6 : 10}
              fill="#FFFFFF"
              filter={`url(#${gradientId}-shadow)`}
              strokeWidth={isMobile ? 1 : 4}
              stroke="#FFFFFF"
              opacity={activePoint === point.season ? 1 : 0}
              aria-hidden={activePoint !== point.season}
            />

            {/* 호버링 전용 line 요소 */}
            <line
              x1={point.x}
              y1={point.y}
              x2={point.x}
              y2={chartConfig.height - chartConfig.padding.bottom}
              stroke="#9B00CF"
              strokeDasharray={isMobile ? '3' : '4'}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth={isMobile ? 1.5 : 2}
              opacity={activePoint === point.season ? 1 : 0}
              aria-hidden={activePoint !== point.season}
            />

            <circle cx={point.x} cy={point.y} r={isMobile ? 4 : 8} fill="#9B00CF" />
          </g>
        ))}

        {/* SVG 그라데이션 defs */}
        <defs>
          <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#BA00FF" />
            <stop offset="50%" stopColor="#9B00CF" />
            <stop offset="100%" stopColor="#BA00FF" />
          </linearGradient>

          <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B00CF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9B00CF" stopOpacity="0" />
          </linearGradient>

          <filter id={`${gradientId}-shadow`} x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#BA00FF" floodOpacity="0.5" />
          </filter>
        </defs>
      </svg>

      {/* Tooltip */}
      {activeChartPoint && (
        <div
          className="absolute bg-white px-1.5 md:px-3  py-1 md:py-2 transition-all duration-200 rounded-sm md:rounded-lg pointer-events-none flex items-center justify-center gap-1.5 whitespace-nowrap label2 md:body1-normal"
          style={{
            left: getTooltipPosition(activeChartPoint).left,
            top: getTooltipPosition(activeChartPoint).top - (isMobile ? 4 : 10),
            transform: isLastPoint ? 'translate(-100%, -100%)' : 'translateY(-100%)',
            boxShadow: '0 0 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Diamond className="w-11 h-11 hidden md:block" />
          <div className="text-caption1 font-semibold md:text-body1-normal md:font-medium">
            {activeChartPoint.tierLabel}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeagueHistoryChart;
