import { useLayoutEffect, useRef, useState } from 'react';

import type { ChartConfig } from './config';

/**
 * 차트 포인트 호버 상태와 툴팁 위치를 관리한다. 툴팁이 오른쪽 경계를 넘으면 왼쪽으로 뒤집는다.
 * 도메인 무관 — 활성 포인트는 key(string)로만 다룬다.
 */
export function useChartTooltip(config: ChartConfig) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [shouldFlip, setShouldFlip] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!tooltipRef.current || !svgRef.current) {
      setShouldFlip(false);
      return;
    }
    const containerWidth = svgRef.current.getBoundingClientRect().width;
    // style.left 는 "50%" 형태이므로 컨테이너 폭 기준 px 로 환산해 오른쪽 넘침을 판단한다.
    const leftPercent = parseFloat(tooltipRef.current.style.left || '0');
    const leftPx = (leftPercent / 100) * containerWidth;
    const tooltipWidth = tooltipRef.current.offsetWidth;
    setShouldFlip(leftPx + tooltipWidth > containerWidth);
  }, [activeKey]);

  // viewBox 좌표를 컨테이너 대비 %로 환산한다. SVG가 preserveAspectRatio="none" w-full 이라
  // viewBox 좌표 비율이 곧 렌더 크기 비율이며, 렌더 중 ref를 읽지 않아도 된다.
  const getTooltipPosition = (point: { px: number; py: number }) => ({
    left: (point.px / config.width) * 100,
    top: (point.py / config.height) * 100,
  });

  return { activeKey, setActiveKey, shouldFlip, svgRef, tooltipRef, getTooltipPosition };
}
