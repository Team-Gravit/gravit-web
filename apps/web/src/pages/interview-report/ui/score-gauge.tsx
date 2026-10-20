import { cn } from '@/shared/lib/cn';

// 시안의 호는 시계 방향 126°에서 시작해 288°를 돈다(아래쪽이 열린 말굽 모양).
const ARC_START_DEGREE = 126;
const ARC_SWEEP_DEGREE = 288;
const VIEWBOX_SIZE = 100;
const CENTER = VIEWBOX_SIZE / 2;

export interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  /** 시안의 링 두께 비율(안쪽 반지름 / 바깥 반지름). 웹 0.8 · 모바일 0.85. */
  innerRadiusRatio: number;
  /** 진행 끝의 손잡이 지름. 전체 지름 대비 비율이다. */
  knobRatio: number;
  className?: string;
}

function pointOnArc(radius: number, degree: number) {
  const radian = (degree * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(radian), y: CENTER + radius * Math.sin(radian) };
}

function describeArc(radius: number, sweepDegree: number) {
  const start = pointOnArc(radius, ARC_START_DEGREE);
  const end = pointOnArc(radius, ARC_START_DEGREE + sweepDegree);
  const largeArcFlag = sweepDegree > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function ScoreGauge({
  score,
  maxScore,
  innerRadiusRatio,
  knobRatio,
  className,
}: ScoreGaugeProps) {
  const ratio = maxScore > 0 ? Math.min(Math.max(score / maxScore, 0), 1) : 0;
  const outerRadius = CENTER;
  const strokeWidth = outerRadius * (1 - innerRadiusRatio);
  const radius = outerRadius - strokeWidth / 2;
  const progressSweep = ARC_SWEEP_DEGREE * ratio;
  const knobPoint = pointOnArc(radius, ARC_START_DEGREE + progressSweep);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      className={cn('overflow-visible', className)}
    >
      <path
        d={describeArc(radius, ARC_SWEEP_DEGREE)}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-purple-100"
      />
      {ratio > 0 ? (
        <path
          d={describeArc(radius, progressSweep)}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-purple-400"
        />
      ) : null}
      <circle
        cx={knobPoint.x}
        cy={knobPoint.y}
        r={(VIEWBOX_SIZE * knobRatio) / 2}
        className="fill-white drop-shadow-sm"
      />
    </svg>
  );
}
