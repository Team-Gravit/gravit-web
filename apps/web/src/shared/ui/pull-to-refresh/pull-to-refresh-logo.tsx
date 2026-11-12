import { cn } from '@/shared/lib/cn';

// 둥근 끝(round cap)은 길이가 0이어도 점이 찍히므로, 거의 당기지 않았을 때는 숨긴다.
const MIN_VISIBLE_PROGRESS = 0.03;

export interface PullToRefreshLogoProps {
  /** 몸통이 그려진 비율(0~1). */
  drawProgress: number;
  /** 놓았을 때 새로고침이 시작될 만큼 당겼는가. */
  isReadyToRefresh: boolean;
  /** 진행 중에는 로고가 튀고, 동작 줄이기 설정에서는 깜빡인다. */
  isRefreshing: boolean;
}

/**
 * 당김 진행률에 따라 그래빗 심볼을 그린다.
 * 로고의 경로를 직접 움직여야 하므로 아이콘 맵 대신 SVG로 둔다.
 */
export function PullToRefreshLogo({
  drawProgress,
  isReadyToRefresh,
  isRefreshing,
}: PullToRefreshLogoProps) {
  return (
    <svg
      viewBox="0 0 69 84"
      fill="none"
      aria-hidden="true"
      data-slot="pull-to-refresh-logo"
      className={cn(
        'w-7.5 overflow-visible text-main',
        drawProgress < MIN_VISIBLE_PROGRESS && 'opacity-0',
        // 튀는 움직임 자체가 진행 중이라는 정보이므로 모션 감소 환경에서도 멈추지 않고 깜빡인다.
        isRefreshing && 'animate-pull-refresh-hop motion-reduce:animate-skeleton-pulse',
      )}
    >
      {/* pathLength=1로 두면 dashoffset 0~1이 그린 비율이 된다. */}
      <path
        d="M6 6V78H63V6H34.956V36.8896H6"
        pathLength={1}
        strokeDasharray={1}
        style={{ strokeDashoffset: 1 - drawProgress }}
        stroke="currentColor"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[19, 32].map((centerX) => (
        <circle
          key={centerX}
          cx={centerX}
          cy={54}
          r={4}
          fill="currentColor"
          className={cn(
            'origin-center transition-transform duration-200 ease-[cubic-bezier(0.34,1.8,0.5,1)] [transform-box:fill-box] motion-reduce:transition-none',
            isReadyToRefresh ? 'scale-100' : 'scale-0',
          )}
        />
      ))}
    </svg>
  );
}
