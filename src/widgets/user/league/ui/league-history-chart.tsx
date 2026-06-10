import { useId, useMemo } from 'react';

import type { LeagueHistory } from '@/entities/league/model/types';
import Tier from '@/entities/league/ui/tier';
import { cn } from '@/shared/lib/cn';
import { formatShortLeagueTier } from '@/shared/lib/format-league-tier';
import useResponsive from '@/shared/model/use-responsive';

import { chartColors, desktopChartConfig, mobileChartConfig } from '../model/chart-config';
import { getLeagueChartData } from '../model/get-league-chart-data';
import useTooltipFlip from '../model/use-tooltip-flip';

interface LeagueHistoryChartProps {
  leagueHistory: LeagueHistory;
}

function LeagueHistoryChart({ leagueHistory }: LeagueHistoryChartProps) {
  const { seasonHistory } = leagueHistory;
  const { isMobile } = useResponsive();

  const gradientId = useId();

  //  svg viewBox 반응형 분기처리
  const chartConfig = isMobile ? mobileChartConfig : desktopChartConfig;

  const { chartPoints, getX, getY, sortOrderToAxisValue, yAxis, minY, areaPath, linePath } =
    useMemo(
      () =>
        getLeagueChartData({
          seasonHistory,
          chartConfig,
        }),
      [seasonHistory, chartConfig],
    );

  const { activePoint, getTooltipPosition, setActivePoint, shouldFlip, svgRef, tooltipRef } =
    useTooltipFlip({ chartConfig });

  const activeChartPoint = chartPoints.find((point) => point.seasonKey === activePoint);
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
        <title>리그 히스토리 차트</title>

        {/* Y축 라벨 */}
        {yAxis.map((axis) => {
          const y = getY(sortOrderToAxisValue.get(axis.sortOrder) ?? minY);

          return (
            <g key={axis.sortOrder}>
              <text
                x={chartConfig.padding.left - chartConfig.yAxisLabelOffset}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="caption1 md:heading2"
                fill={chartColors.labelColor}
              >
                {formatShortLeagueTier(axis.leagueName)}
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
        {seasonHistory.map((point, index) => (
          <text
            key={`${point.seasonKey}-label`}
            x={getX(index)}
            y={chartConfig.height - 2}
            textAnchor="middle"
            className={cn('caption1', point.isCurrent ? 'md:text-title3' : 'md:text-heading2')}
            fill={point.isCurrent ? chartColors.brand : chartColors.labelColor}
          >
            {point.isCurrent ? '현재' : point.seasonKey}
          </text>
        ))}

        {/* Background 그라데이션 요소 */}
        <path d={areaPath} fill={`url(#${gradientId}-area)`} />

        {/* Line 요소 */}
        <path d={linePath} fill="none" stroke={`url(#${gradientId}-line)`} strokeWidth={2} />

        {chartPoints.map((point) => {
          const isActive = activePoint === point.seasonKey;

          return (
            <g
              key={point.seasonKey}
              onPointerEnter={() => setActivePoint(point.seasonKey)}
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
                opacity={isActive ? 1 : 0}
                aria-hidden={!isActive}
              />

              {/* 호버링 전용 line 요소 */}
              <line
                x1={point.x}
                y1={point.y}
                x2={point.x}
                y2={chartConfig.height - chartConfig.padding.bottom}
                stroke={chartColors.brand}
                strokeDasharray={isMobile ? '3' : '4'}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={isMobile ? 1.5 : 2}
                opacity={isActive ? 1 : 0}
                aria-hidden={!isActive}
              />

              <circle cx={point.x} cy={point.y} r={isMobile ? 4 : 8} fill={chartColors.brand} />
            </g>
          );
        })}

        {/* SVG 그라데이션 defs */}
        <defs>
          <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={chartColors.brandLight} />
            <stop offset="50%" stopColor={chartColors.brand} />
            <stop offset="100%" stopColor={chartColors.brandLight} />
          </linearGradient>

          <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.brand} stopOpacity="0.7" />
            <stop offset="100%" stopColor={chartColors.brand} stopOpacity="0" />
          </linearGradient>

          <filter id={`${gradientId}-shadow`} x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor={chartColors.brandLight}
              floodOpacity="0.5"
            />
          </filter>
        </defs>
      </svg>

      {activeChartPoint &&
        (() => {
          const tooltipPosition = getTooltipPosition(activeChartPoint);

          return (
            <div
              ref={tooltipRef}
              className="absolute bg-white px-1.5 md:px-3  py-1 md:py-2 transition-all duration-200  md:transition-none rounded-sm md:rounded-lg pointer-events-none flex items-center justify-center gap-1.5 whitespace-nowrap label2 md:body1-normal"
              style={{
                left: tooltipPosition.left,
                top: tooltipPosition.top - (isMobile ? 4 : 10),
                transform: shouldFlip ? 'translate(-100%, -100%)' : 'translateY(-100%)',
                boxShadow: '0 0 12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div className="text-caption1 font-semibold md:text-body1-normal md:font-medium flex items-center gap-2">
                <div className="md:block hidden">
                  <Tier tierName={activeChartPoint.leagueName} size="sm" />
                </div>
                {activeChartPoint.leagueName}
              </div>
            </div>
          );
        })()}
    </div>
  );
}

export default LeagueHistoryChart;
