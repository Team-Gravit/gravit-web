import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export type CardHeaderProps = ComponentProps<'div'>;

/** 카드 제목과 선택적 헤더 액션을 양 끝에 배치한다. */
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn('flex w-full items-center justify-between', className)}
      {...props}
    />
  );
}

export type CardTitleProps = ComponentProps<'h2'>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h2
      data-slot="card-title"
      className={cn('text-label2 text-text-4 md:text-body1-normal', className)}
      {...props}
    />
  );
}
