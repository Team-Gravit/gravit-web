import { type ReactNode, type TransitionEvent, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { toast } from '@/shared/ui/toast';

import { PullToRefreshLogo } from './pull-to-refresh-logo';
import { PULL_THRESHOLD_PX, type PullStatus, usePullToRefresh } from './use-pull-to-refresh';

export const PULL_TO_REFRESH_FAILURE_MESSAGE = '새로고침에 실패했어요. 다시 시도해 주세요.';

// 손가락을 따라갈 때는 바로 반영하고, 놓은 뒤에만 부드럽게 제자리로 돌아간다.
const SETTLE_TRANSITION_CLASS = 'duration-300 ease-out motion-reduce:transition-none';

export interface PullToRefreshProps {
  /** 거부하면 실패 토스트를 띄운다. */
  onRefresh: () => Promise<unknown>;
  children: ReactNode;
  className?: string;
  /**
   * 콘텐츠가 상태 표시줄 뒤에서 시작하면 켠다. 로고를 상단 안전 영역 아래에 그려
   * 노치·상태 표시줄에 가리지 않게 한다. 콘텐츠의 상단 안전 영역 여백 위에 겹쳐 그린다.
   */
  isUnderStatusBar?: boolean;
}

function handleRefreshError() {
  toast(PULL_TO_REFRESH_FAILURE_MESSAGE);
}

/**
 * 콘텐츠를 아래로 당겨 임계 거리를 넘겨 놓으면 onRefresh를 실행한다.
 * 요청이 실패하면 토스트로 알리고, 진행 중에는 상태 문구를 스크린 리더에 제공한다.
 *
 * 당기는 동안 콘텐츠에 transform이 걸려 안쪽의 `position: fixed` 요소도 함께 움직인다.
 *
 * 감싼 콘텐츠는 세로 flex 안에서 남은 높이를 채운다. 화면 최소 높이는 `className`으로
 * 이 컴포넌트에 주고, 안쪽 루트는 `min-h-full` 대신 `flex-1`로 늘린다.
 * 높이가 정해진 영역 안에서 안쪽 목록이 스스로 스크롤해도 된다 (`min-h-0`).
 */
export function PullToRefresh({
  onRefresh,
  children,
  className,
  isUnderStatusBar = false,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { status, distance } = usePullToRefresh({
    containerRef,
    onRefresh,
    onRefreshError: handleRefreshError,
  });

  // 새로고침이 끝나 틈이 닫히는 동안 로고를 다 그린 채로 둔다. 상태만 보면 곧바로 지워진다.
  const [isCollapsing, setIsCollapsing] = useState(false); // 새로고침이 끝나고 닫히는 중인지
  const [previousStatus, setPreviousStatus] = useState<PullStatus>(status);
  if (status !== previousStatus) {
    setPreviousStatus(status);
    setIsCollapsing(previousStatus === 'refreshing');
  }

  const shouldAnimatePosition = status !== 'pulling' && status !== 'canRelease';
  const isLogoComplete = status === 'refreshing' || isCollapsing;
  const logoDrawProgress = isLogoComplete ? 1 : Math.min(distance / PULL_THRESHOLD_PX, 1);

  // 콘텐츠가 제자리로 돌아오는 애니메이션이 끝나면 유지 상태 해제
  function handleContentTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    // 안쪽 요소의 transition이 버블링된 것은 무시한다.
    if (event.target === event.currentTarget) {
      setIsCollapsing(false);
    }
  }

  return (
    <div
      ref={containerRef}
      data-slot="pull-to-refresh"
      data-status={status}
      className={cn('relative flex flex-col', className)}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 flex items-center justify-center overflow-hidden',
          // 뒤따르는 콘텐츠보다 위에 그린다. 겹치는 곳은 콘텐츠가 상태 표시줄 몫으로 비워 둔 여백이다.
          isUnderStatusBar ? 'top-(--safe-area-top) z-10' : 'top-0',
          shouldAnimatePosition && ['transition-[height]', SETTLE_TRANSITION_CLASS],
        )}
        style={{ height: distance }}
      >
        <PullToRefreshLogo
          drawProgress={logoDrawProgress}
          isReadyToRefresh={status === 'canRelease' || isLogoComplete}
          isRefreshing={status === 'refreshing'}
        />
      </div>
      <div
        className={cn(
          'relative flex min-h-0 flex-1 flex-col',
          shouldAnimatePosition && ['transition-transform', SETTLE_TRANSITION_CLASS],
        )}
        style={{ transform: distance > 0 ? `translate3d(0, ${distance}px, 0)` : undefined }}
        onTransitionEnd={handleContentTransitionEnd}
      >
        {children}
      </div>
      <span role="status" className="sr-only">
        {status === 'refreshing' ? '새로고침 중' : ''}
      </span>
    </div>
  );
}
