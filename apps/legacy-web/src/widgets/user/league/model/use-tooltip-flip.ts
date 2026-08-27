import { useLayoutEffect, useRef, useState } from 'react';

import type { ChartConfig } from './chart-config';

interface UseTooltipFlipProps {
  chartConfig: ChartConfig;
}

function useTooltipFlip({ chartConfig }: UseTooltipFlipProps) {
  const [shouldFlip, setShouldFlip] = useState(false);
  const [activePoint, setActivePoint] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!tooltipRef.current || !svgRef.current) {
      setShouldFlip(false);
      return;
    }
    const left = parseFloat(tooltipRef.current.style.left || '0');
    const tooltipWidth = tooltipRef.current.offsetWidth;
    const containerWidth = svgRef.current.getBoundingClientRect().width;
    setShouldFlip(left + tooltipWidth > containerWidth);
  }, [activePoint]);

  const getTooltipPosition = (point: { x: number; y: number }) => {
    const svgBox = svgRef.current?.getBoundingClientRect();
    if (!svgBox) return { left: 0, top: 0 };

    return {
      left: (point.x / chartConfig.width) * svgBox.width,
      top: (point.y / chartConfig.height) * svgBox.height,
    };
  };

  return {
    svgRef,
    tooltipRef,
    setActivePoint,
    activePoint,
    shouldFlip,
    getTooltipPosition,
  };
}

export default useTooltipFlip;
