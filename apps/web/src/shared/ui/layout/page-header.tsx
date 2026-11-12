import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface PageHeaderProps {
  /** 화면의 제목 - 이 화면의 `h1`*/
  title: string;
  /** 뒤로가기처럼 왼쪽에 놓는 조작 요소*/
  leftSlot?: ReactNode;
  className?: string;
}

export function PageHeader({ title, leftSlot, className }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        // box-content: 내용 높이 h-12는 그대로 두고 상태 표시줄 여백만큼 헤더를 위로 늘린다.
        'relative box-content flex h-12 shrink-0 items-center justify-center border-b border-divider-1 pt-(--safe-area-top)',
        className,
      )}
    >
      {leftSlot ? (
        <div className="absolute top-(--safe-area-top) left-0 flex h-12 items-center">
          {leftSlot}
        </div>
      ) : null}
      <h1 className="text-label1 text-text-2">{title}</h1>
    </header>
  );
}
