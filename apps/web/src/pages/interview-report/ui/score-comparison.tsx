import { cn } from '@/shared/lib/cn';
import { compareWithAverage, type AverageComparison } from '@/entities/interview';

const COMPARISON_MARK_CLASS: Record<AverageComparison, string> = {
  higher: 'fill-semantic-error',
  lower: 'rotate-180 fill-semantic-5',
  same: 'hidden',
};

// 추이선 영역. 평균선은 「평균」 글자와 높이를 맞추기 위해 항상 세로 가운데에 둔다.
const SPARKLINE_WIDTH = 100;
const SPARKLINE_HEIGHT = 24;
const SPARKLINE_CENTER_Y = SPARKLINE_HEIGHT / 2;

export interface ScoreComparisonProps {
  label: string;
  score: number;
  average: number;
  /** 이 세션을 포함한 최근 세션 점수 (오래된 순). */
  recentScores: number[];
  layout: 'wide' | 'narrow';
}

export function ScoreComparison({
  label,
  score,
  average,
  recentScores,
  layout,
}: ScoreComparisonProps) {
  const isWide = layout === 'wide';
  const { comparison, message } = compareWithAverage(score, average);

  return (
    <div
      className={cn(
        'relative flex items-center',
        isWide ? 'gap-6 px-4 lg:gap-10 lg:px-6' : 'pr-3 sm:gap-6 sm:pr-0',
      )}
    >
      <div className={cn('flex shrink-0 flex-col', isWide ? 'gap-2 lg:w-42.5' : 'gap-1')}>
        <span
          className={cn(
            'text-text-4',
            isWide ? 'text-body1-normal' : 'text-caption2 sm:text-label2',
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'text-text-1',
            isWide ? 'flex items-center gap-2' : 'text-headline2 sm:text-heading2',
          )}
        >
          {isWide ? (
            <>
              <span className="text-title1">{score}</span>
              <span className="text-title3">점</span>
            </>
          ) : (
            `${score}점`
          )}
        </span>
        <span
          className={cn(
            'flex items-center text-text-3',
            isWide ? 'gap-2 text-body1-normal' : 'gap-1 text-caption2 sm:text-label2',
          )}
        >
          <svg
            aria-hidden
            viewBox="0 0 14 10"
            className={cn(
              isWide ? 'h-2.5 w-3.5' : 'h-1.5 w-2 sm:h-2 sm:w-2.5',
              COMPARISON_MARK_CLASS[comparison],
            )}
          >
            <path d="M7 0 14 10H0Z" />
          </svg>
          {message}
        </span>
      </div>
      <Sparkline
        recentScores={recentScores}
        average={average}
        // 모바일 시안은 좁은 폭에서 점수 오른쪽 위에 겹쳐 둔다. 640px부터는 점수 옆에 붙여 끝으로 밀려나지 않게 한다.
        className={
          isWide
            ? 'min-w-20 flex-1'
            : 'absolute top-4.25 right-0 w-19.5 sm:static sm:w-auto sm:max-w-40 sm:flex-1'
        }
        showAverageLabel={isWide}
      />
    </div>
  );
}

interface SparklineProps {
  recentScores: number[];
  average: number;
  showAverageLabel: boolean;
  className?: string;
}

function Sparkline({ recentScores, average, showAverageLabel, className }: SparklineProps) {
  // 평균에서 가장 멀리 떨어진 점수가 위 또는 아래 끝에 닿도록 위아래를 같은 배율로 나눈다.
  const maxDistance = Math.max(
    ...recentScores.map((sessionScore) => Math.abs(sessionScore - average)),
    1,
  );
  const getYPosition = (sessionScore: number) =>
    SPARKLINE_CENTER_Y - ((sessionScore - average) / maxDistance) * SPARKLINE_CENTER_Y;
  const step = recentScores.length > 1 ? SPARKLINE_WIDTH / (recentScores.length - 1) : 0;
  const points = recentScores.map((sessionScore, index) => ({
    x: index * step,
    y: getYPosition(sessionScore),
  }));
  const lastPoint = points.at(-1);

  return (
    <div aria-hidden className={cn('flex items-center gap-4', className)}>
      <div className="relative h-6 flex-1">
        <svg
          viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <line
            x1={0}
            x2={SPARKLINE_WIDTH}
            y1={SPARKLINE_CENTER_Y}
            y2={SPARKLINE_CENTER_Y}
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
            className="stroke-divider-1"
          />
          {points.length > 1 ? (
            <polyline
              points={points.map((point) => `${point.x},${point.y}`).join(' ')}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="stroke-divider-1"
            />
          ) : null}
        </svg>
        {lastPoint ? (
          // 선은 가로로 늘어나지만 점은 원형을 유지해야 해서 SVG 밖에 둔다.
          <span
            className="absolute size-1.25 -translate-1/2 rounded-full bg-main-1"
            style={{
              left: `${(lastPoint.x / SPARKLINE_WIDTH) * 100}%`,
              top: `${(lastPoint.y / SPARKLINE_HEIGHT) * 100}%`,
            }}
          />
        ) : null}
      </div>
      {showAverageLabel ? <span className="shrink-0 text-label1 text-divider-2">평균</span> : null}
    </div>
  );
}
