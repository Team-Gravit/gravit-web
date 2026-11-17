import { type ReactNode, useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { withObjectParticle } from '@/shared/lib/korean-particle';
import { Button, type ButtonProps } from '@/shared/ui/button';
import {
  MIN_REFRESH_DURATION_MS,
  PULL_TO_REFRESH_FAILURE_MESSAGE,
} from '@/shared/ui/pull-to-refresh';
import { toast } from '@/shared/ui/toast';

export interface CardStatusProps {
  message: string;
  /** 상태 문구 아래에 표시할 후속 행동. */
  action?: ReactNode;
  /**
   * error — 요청 실패. `role="alert"` 로 즉시 알린다.
   * empty — 데이터 없음. 조용한 `role="status"`.
   */
  tone?: 'error' | 'empty';
  className?: string;
}

/** 카드 본문의 에러·빈 상태 공통 표현. 셸과 헤더는 그대로 두고 본문만 이걸로 바꾼다. */
export function CardStatus({ message, action, tone = 'empty', className }: CardStatusProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      data-slot="card-status"
      data-tone={tone}
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-4 md:gap-8 text-center',
        className,
      )}
    >
      <p className="text-label1 md:text-heading1 text-text-4">{message}</p>
      {action}
    </div>
  );
}

// ButtonProps 는 asChild · isLoading 배타 유니온이라, Omit 을 분기마다 적용해야 배타가 유지된다.
type WithoutVisual<P> = P extends unknown ? Omit<P, 'variant' | 'size'> : never;

export type CardStatusButtonProps = WithoutVisual<ButtonProps>;

/**
 * 카드 상태(에러 · 빈 상태)의 행동 버튼. 재시도와 빈 상태 행동이 같은 모양을 쓰도록
 * 모양(variant · size)은 여기서만 정한다. 링크로 쓸 때는 `asChild`.
 */
export function CardStatusButton(props: CardStatusButtonProps) {
  // TODO(design): Button 크기 확정 후 모바일 sm·데스크톱 lg 적용을 재검토한다.
  return <Button {...props} variant="default" size={{ base: 'sm', md: 'lg' }} />;
}

export interface CardRetryStatusProps {
  /** 「{sectionName}을/를 불러오지 못했어요.」의 섹션 이름. 조사는 여기서 붙인다. */
  sectionName: string;
  /** 거부되면 실패로 보고 토스트를 띄운다. Query는 `refetch({ throwOnError: true })`를 넘긴다. */
  onRetry: () => Promise<unknown>;
  className?: string;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * 섹션 이름에 맞춘 실패 문구와 재시도 버튼을 표시한다.
 * 진행 표시 · 최소 표시 시간 · 실패 토스트는 pull-to-refresh와 같게 맞춘다.
 */
export function CardRetryStatus({ sectionName, onRetry, className }: CardRetryStatusProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  async function handleRetry() {
    setIsRetrying(true);
    // 응답이 빨라도 진행 표시가 깜빡이고 사라지지 않게 한다.
    const minimumDuration = wait(MIN_REFRESH_DURATION_MS);

    try {
      await onRetry();
    } catch {
      toast(PULL_TO_REFRESH_FAILURE_MESSAGE);
    } finally {
      await minimumDuration;
      setIsRetrying(false);
    }
  }

  return (
    <CardStatus
      tone="error"
      message={`${withObjectParticle(sectionName)} 불러오지 못했어요.`}
      className={className}
      action={
        <CardStatusButton type="button" isLoading={isRetrying} onClick={() => void handleRetry()}>
          다시 시도
        </CardStatusButton>
      }
    />
  );
}
