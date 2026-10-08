import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';

export type CardProps = ComponentProps<'section'>;

/** 메인 섹션의 공통 셸. 상태가 바뀌어도 셸과 헤더는 유지하고 본문만 교체한다. */
export function Card({ className, ...props }: CardProps) {
  return (
    <section
      data-slot="card"
      className={cn(
        // TODO(design): 공용 shadow 토큰이 확정되면 Figma의 현재 값을 정식 토큰으로 교체한다.
        'flex w-full flex-col gap-4 rounded-8 bg-white p-3 shadow-[0px_4px_32px_0px_#00000006] md:rounded-12 md:p-5',
        className,
      )}
      {...props}
    />
  );
}
