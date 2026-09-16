import type { ReactNode } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

export interface PageTitleBarProps {
  title: string;
  /**
   * 왼쪽 뒤로 가기 링크의 목적지입니다. 전달하지 않으면 링크를 표시하지 않습니다.
   *
   * 알림이나 외부 링크로 바로 들어와도 서비스 안의 상위 화면으로 이동하도록 브라우저 히스토리
   * 대신 명시적인 경로를 받습니다.
   */
  backTo?: LinkProps;
  /** 화면별 보조 액션을 오른쪽에 배치합니다. */
  rightSlot?: ReactNode;
  className?: string;
}

/**
 * 좁은 화면 상단에 제목과 탐색 액션을 표시합니다. 넓은 화면에서는 `widgets/header`가 같은
 * 역할을 하므로 페이지가 화면 폭에 맞는 컴포넌트 하나만 선택합니다.
 *
 * 앱 셸의 콘텐츠 영역이 스크롤을 소유하므로 스크롤 중에도 상단에 고정됩니다.
 */
export function PageTitleBar({ title, backTo, rightSlot, className }: PageTitleBarProps) {
  return (
    <header
      data-slot="page-title-bar"
      className={cn(
        'sticky top-0 z-50 flex h-12 shrink-0 items-center justify-center border-b border-divider-1 bg-white px-5',
        className,
      )}
    >
      {/* 좌우 액션의 너비와 관계없이 제목을 가운데에 두기 위해 액션을 흐름에서 분리합니다. */}
      {backTo ? (
        <Link {...backTo} aria-label="뒤로 가기" className="absolute left-5 inline-flex">
          <Icon name="chevron-left" className="text-text-3" />
        </Link>
      ) : null}
      <h1 className="text-label1 text-text-2">{title}</h1>
      {rightSlot ? <div className="absolute right-5 inline-flex">{rightSlot}</div> : null}
    </header>
  );
}
