import { Fragment } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

/**
 * `link`가 없는 항목은 현재 위치를 나타내므로 목록의 마지막에 둡니다.
 *
 * 완성된 URL 대신 라우트 패턴과 params를 받아 경로가 바뀌었을 때 타입 검사로 오류를 찾습니다.
 */
export type BreadcrumbItem = { label: string; link: LinkProps } | { label: string; link?: never };

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * 현재 위치와 상위 경로를 표시합니다. 현재 위치는 링크 대신 `aria-current="page"`를 가진
 * 텍스트로 표시합니다.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="현재 위치"
      data-slot="breadcrumb"
      className={cn('flex items-center gap-1', className)}
    >
      {items.map((item, index) => (
        // Breadcrumb 순서는 렌더링 중 바뀌지 않으므로 위치 인덱스를 key로 사용합니다.
        <Fragment key={index}>
          {item.link ? (
            <Link {...item.link} className="text-body1-normal text-text-3">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-headline2 text-text-2">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <Icon name="chevron-right" size={16} className="text-text-3" />
          )}
        </Fragment>
      ))}
    </nav>
  );
}
