import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { withObjectParticle } from '@/shared/lib/korean-particle';
import { Button } from '@/shared/ui/button';

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

export interface CardRetryStatusProps {
  /** 「{sectionName}을/를 불러오지 못했어요.」의 섹션 이름. 조사는 여기서 붙인다. */
  sectionName: string;
  onRetry: () => void;
  className?: string;
}

/** 섹션 이름에 맞춘 실패 문구와 재시도 버튼을 표시한다. */
export function CardRetryStatus({ sectionName, onRetry, className }: CardRetryStatusProps) {
  return (
    <CardStatus
      tone="error"
      message={`${withObjectParticle(sectionName)} 불러오지 못했어요.`}
      className={className}
      action={
        // TODO(design): Button 크기 확정 후 모바일 sm·데스크톱 lg 적용을 재검토한다.
        <Button type="button" variant="default" size={{ base: 'sm', md: 'lg' }} onClick={onRetry}>
          다시 시도
        </Button>
      }
    />
  );
}
