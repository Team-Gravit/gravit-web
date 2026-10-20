import { useId, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import type { InterviewScoreTrendResponse } from '@/entities/interview';

import { getTrendXRatios, getTrendYRatio } from '../lib/score-trend-layout';

export interface ScoreTrendChartProps {
  /** 오래된 순. 마지막 항목이 「현재」다. */
  trends: InterviewScoreTrendResponse[];
}

// 선과 영역만 SVG로 그려 화면 폭이 바뀌어도 점과 글자 크기는 유지한다.
export function ScoreTrendChart({ trends }: ScoreTrendChartProps) {
  const gradientId = useId();
  const lastIndex = trends.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(lastIndex);
  // 재조회로 항목 수가 줄어도 범위 안의 점을 가리키게 한다.
  const activeIndex = Math.min(selectedIndex, lastIndex);

  const xRatios = getTrendXRatios(trends.length);
  const points = trends.map((trend, index) => ({
    ...trend,
    isCurrent: index === lastIndex,
    left: xRatios[index] * 100,
    top: (1 - getTrendYRatio(trend.score)) * 100,
  }));
  const activePoint = points[activeIndex];

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.left} ${point.top}`)
    .join(' ');
  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[lastIndex].left} 100 L ${points[0].left} 100 Z`
      : '';

  return (
    <div data-slot="score-trend-chart" className="flex flex-col gap-1.5 pt-7 md:gap-2.5 md:pt-12">
      <div className="relative h-25.5 md:h-62.5">
        <div
          aria-hidden
          className="absolute inset-x-0 top-2.5 bottom-0 flex flex-col justify-between md:inset-y-3.75"
        >
          <div className="h-px bg-divider-1 md:h-[1.5px]" />
          <div className="h-px bg-divider-1 md:h-[1.5px]" />
          <div className="h-px bg-divider-1 md:h-[1.5px]" />
        </div>

        <div className="absolute inset-x-4 top-2.5 bottom-0 md:inset-x-7 md:inset-y-3.75">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-cta)"
                  className="[stop-opacity:0.7] md:[stop-opacity:0.25]"
                />
                <stop offset="100%" stopColor="var(--color-cta)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
            <path
              d={linePath}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className="stroke-cta [stroke-width:1px] md:[stroke-width:1.5px]"
            />
            <line
              x1={activePoint.left}
              y1={activePoint.top}
              x2={activePoint.left}
              y2={100}
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
              className="stroke-cta [stroke-width:1.5px]"
            />
          </svg>

          {points.map((point, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={point.sequence}
                type="button"
                aria-label={`${point.isCurrent ? '현재' : `${point.sequence}차`} ${point.score}점`}
                aria-pressed={isActive}
                onClick={() => setSelectedIndex(index)}
                style={{ left: `${point.left}%`, top: `${point.top}%` }}
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-cta',
                  isActive
                    ? 'size-3 ring-2 ring-bg-1 shadow-[0px_4px_32px_0px_#00000006] md:ring-4'
                    : 'size-2 md:size-3',
                )}
              />
            );
          })}

          <div
            role="status"
            style={{ left: `${activePoint.left}%`, top: `${activePoint.top}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-4 bg-bg-1 px-1.5 py-1 text-label2 whitespace-nowrap text-text-1 shadow-elevation-2 md:-translate-y-[calc(100%+16px)] md:rounded-8 md:px-3 md:py-2 md:text-body1-normal"
          >
            {activePoint.score}점
          </div>
        </div>
      </div>

      <div aria-hidden className="relative mx-4 h-5.25 md:mx-7 md:h-7.5">
        {points.map((point) => (
          <span
            key={point.sequence}
            style={{ left: `${point.left}%` }}
            className={cn(
              'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-caption1',
              point.isCurrent ? 'text-cta md:text-title3' : 'text-text-3 md:text-heading2',
            )}
          >
            {point.isCurrent ? '현재' : `${point.sequence}차`}
          </span>
        ))}
      </div>
    </div>
  );
}
