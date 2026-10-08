import type { ReactNode } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { useHistoryBackClick } from '@/shared/lib/use-history-back-click';
import { Icon } from '@/shared/ui/icon';

export interface PageTitleBarProps {
  title: string;
  /**
   * 이전 방문 기록이 없을 때 이동할 경로. 생략하면 탐색 링크를 숨긴다.
   */
  backTo?: LinkProps;
  /** 왼쪽 탐색의 의미와 아이콘. `close`는 전체 화면에서 빠져나갈 때 사용한다. */
  backIcon?: 'back' | 'close';
  /** 화면별 보조 액션을 오른쪽에 배치한다. */
  rightSlot?: ReactNode;
  className?: string;
}

/**
 * 좁은 화면에 사용하는 고정 제목 막대.
 * 넓은 화면에서는 같은 역할의 `widgets/header`를 사용한다.
 */
export function PageTitleBar({
  title,
  backTo,
  backIcon = 'back',
  rightSlot,
  className,
}: PageTitleBarProps) {
  const handleBackClick = useHistoryBackClick();

  return (
    <header
      data-slot="page-title-bar"
      className={cn(
        'sticky top-0 z-50 flex h-12 shrink-0 items-center justify-center border-b border-divider-1 bg-white',
        className,
      )}
    >
      {/* 좌우 액션 너비와 관계없이 제목을 가운데에 두기 위해 액션을 흐름에서 분리한다. */}
      {backTo ? (
        <Link
          {...backTo}
          onClick={handleBackClick}
          aria-label={backIcon === 'close' ? '닫기' : '뒤로 가기'}
          className="absolute left-0 inline-flex p-3"
        >
          <Icon name={backIcon === 'close' ? 'close-md' : 'chevron-left'} className="text-text-3" />
        </Link>
      ) : null}
      <h1 className="text-label1 text-text-2">{title}</h1>
      {rightSlot ? <div className="absolute right-5 inline-flex">{rightSlot}</div> : null}
    </header>
  );
}
