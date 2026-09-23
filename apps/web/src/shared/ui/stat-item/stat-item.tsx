import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface StatItemProps {
  /** 강조 수치. 단위·부가값은 사용처에서 조립해 넘긴다. */
  value: ReactNode;
  label: string;
  /** 값을 main 색으로 강조한다(예: 순위). */
  highlight?: boolean;
  /** 지정하면 버튼으로 렌더해 클릭할 수 있다(예: 팔로우 수 → 모달 열기). */
  onClick?: () => void;
  /** 구분선·표시 제어 등 배치는 사용처가 className으로 정한다. */
  className?: string;
}

/** 값(큰 수치) + 라벨의 통계 아이템. 여러 개를 가로로 나열해 통계 묶음을 만든다. */
export function StatItem({ value, label, highlight, onClick, className }: StatItemProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn('flex flex-1 flex-col items-center gap-1', className)}
    >
      <h3
        className={cn(
          'flex items-baseline gap-1 text-headline2 md:text-title1',
          highlight ? 'text-main' : 'text-text-1',
        )}
      >
        {value}
      </h3>
      <span className="text-caption1 text-text-4 md:text-body1-normal">{label}</span>
    </Component>
  );
}
