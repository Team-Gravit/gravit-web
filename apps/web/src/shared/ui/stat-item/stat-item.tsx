import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

const statValueVariants = cva('flex items-baseline gap-1', {
  variants: {
    size: {
      default: 'text-headline2 md:text-title1',
      compact: 'text-headline2 md:text-heading1',
    },
    tone: {
      default: 'text-text-1',
      muted: 'text-text-2',
      accent: 'text-main',
    },
  },
  defaultVariants: {
    size: 'default',
    tone: 'default',
  },
});

export interface StatItemProps {
  /** 표시할 수치. 단위나 부가값은 호출부에서 조합한다. */
  value: ReactNode;
  label: string;
  valueSize?: 'default' | 'compact';
  valueTone?: 'default' | 'muted' | 'accent';
  /** 지정하면 루트 요소를 `button`으로 렌더링한다. */
  onClick?: () => void;
  className?: string;
}

export function StatItem({
  value,
  label,
  valueSize = 'default',
  valueTone = 'default',
  onClick,
  className,
}: StatItemProps) {
  const Root = onClick ? 'button' : 'div';

  return (
    <Root
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn('flex flex-1 flex-col items-center gap-1', className)}
    >
      <h3 className={statValueVariants({ size: valueSize, tone: valueTone })}>{value}</h3>
      <span className="text-caption1 text-text-4 md:text-body1-normal">{label}</span>
    </Root>
  );
}
