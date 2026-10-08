import { useId, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { DESKTOP_CHART_CONFIG, MOBILE_CHART_CONFIG } from './config';
import { getChartGeometry, type LineChartPoint } from './get-chart-geometry';
import { useChartTooltip } from './use-chart-tooltip';

export interface LineChartYTick {
  /** points의 y와 같은 스케일의 값 */
  value: number;
  label: ReactNode;
}

interface LineChartProps<T extends LineChartPoint> {
  points: T[];
  /** Y축 눈금·라벨·가로 그리드. 없으면 Y축을 그리지 않는다(X축만). */
  yTicks?: LineChartYTick[];
  /** X축 라벨 텍스트. `point.highlight`면 차트가 강조 스타일을 입힌다. */
  renderXLabel?: (point: T) => ReactNode;
  /** 호버 시 포인트 위에 뜨는 툴팁 내용. */
  renderTooltip?: (point: T) => ReactNode;
  className?: string;
}

/**
 * 도메인 무관 라인+영역 차트. 좌표 스케일·SVG 렌더·호버 툴팁을 소유하고,
 * Y축 눈금·X축 라벨·툴팁 내용만 주입받는다. `yTicks`를 생략하면 X축만 그린다.
 */
export function LineChart<T extends LineChartPoint>({
  points,
  yTicks,
  renderXLabel,
  renderTooltip,
  className,
}: LineChartProps<T>) {
  const isWide = useIsWideViewport();
  const config = isWide ? DESKTOP_CHART_CONFIG : MOBILE_CHART_CONFIG;
  const gradientId = useId();

  // Y 범위: yTicks가 있으면 그 값 범위, 없으면 데이터 y의 min/max. 최소 1 폭을 보장한다.
  const yValues = yTicks?.length
    ? yTicks.map((tick) => tick.value)
    : points.map((point) => point.y);
  const yMin = yValues.length ? Math.min(...yValues) : 0;
  const yMax = Math.max(yMin + 1, ...yValues);

  const { positioned, getY, linePath, areaPath, plotBottomY } = getChartGeometry({
    points,
    config,
    yMin,
    yMax,
  });

  const { activeKey, setActiveKey, shouldFlip, svgRef, tooltipRef, getTooltipPosition } =
    useChartTooltip(config);
  const activePoint = positioned.find((point) => point.key === activeKey);

  return (
    <div className={cn('relative w-full', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="h-full w-full"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        {/* Y축 라벨 + 가로 그리드 (optional) */}
        {yTicks?.map((tick) => {
          const y = getY(tick.value);
          return (
            <g key={tick.value}>
              <text
                x={config.padding.left - config.yAxisLabelOffset}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-text-3 text-caption1 md:text-heading2"
              >
                {tick.label}
              </text>
              <line
                x1={config.padding.left - config.yAxisLineOverFlow}
                x2={config.width - config.padding.right + config.yAxisLineOverFlow}
                y1={y}
                y2={y}
                className="stroke-bg-3"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* X축 라벨 */}
        {renderXLabel &&
          positioned.map((point) => (
            <text
              key={`${point.key}-x`}
              x={point.px}
              y={config.height - 2}
              textAnchor="middle"
              className={cn(
                'text-caption1',
                point.highlight ? 'fill-main md:text-title3' : 'fill-[#646464] md:text-heading2',
              )}
            >
              {renderXLabel(point)}
            </text>
          ))}

        {/* 영역 + 라인 */}
        <path d={areaPath} fill={`url(#${gradientId}-area)`} />
        <path d={linePath} fill="none" stroke={`url(#${gradientId}-line)`} strokeWidth={2} />

        {/* 포인트 + 호버 표시 */}
        {positioned.map((point) => {
          const isActive = activeKey === point.key;
          return (
            <g
              key={point.key}
              onPointerEnter={() => setActiveKey(point.key)}
              onPointerLeave={() => {
                if (isWide) {
                  setActiveKey(null);
                }
              }}
            >
              <line
                x1={point.px}
                y1={point.py}
                x2={point.px}
                y2={plotBottomY}
                className="stroke-main"
                strokeDasharray={isWide ? '4' : '3'}
                strokeWidth={isWide ? 2 : 1.5}
                opacity={isActive ? 1 : 0}
                aria-hidden={!isActive}
              />
              <circle cx={point.px} cy={point.py} r={isWide ? 8 : 4} className="fill-main" />
            </g>
          );
        })}

        <defs>
          <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-main-end)" />
            <stop offset="50%" stopColor="var(--color-main)" />
            <stop offset="100%" stopColor="var(--color-main-end)" />
          </linearGradient>
          <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-main)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-main)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 호버 툴팁 */}
      {activePoint &&
        renderTooltip &&
        (() => {
          const position = getTooltipPosition(activePoint);
          const offsetPx = isWide ? 10 : 4;
          return (
            <div
              ref={tooltipRef}
              className="pointer-events-none absolute flex items-center gap-2 whitespace-nowrap rounded-4 bg-bg-1 px-1.5 py-1 shadow-elevation-2 md:rounded-8 md:px-3 md:py-2"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                transform: shouldFlip
                  ? `translate(-100%, calc(-100% - ${offsetPx}px))`
                  : `translateY(calc(-100% - ${offsetPx}px))`,
              }}
            >
              {renderTooltip(activePoint)}
            </div>
          );
        })()}
    </div>
  );
}
