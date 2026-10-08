import type { ReactNode } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';

interface TabsProps {
  children: ReactNode;
  className?: string;
}

type TabProps = LinkProps & {
  className?: string;
  children: ReactNode;
};

const TAB_ACTIVE = 'bg-cta text-text-1-w';
const TAB_INACTIVE = 'bg-transparent';
const TAB_BASE = cn(
  'flex flex-1 items-center justify-center px-2.5',
  'h-9 md:h-auto md:py-4',
  'rounded-4 md:rounded-8 transition-colors',
);

/** 링크 탭을 담는 컴파운드 컨테이너. 활성 상태는 라우트 매칭으로 `Tabs.Tab`이 표시한다. */
export function Tabs({ children, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex w-full items-center gap-1 p-1 md:gap-2 md:p-2',
        'rounded-8 bg-bg-1 md:rounded-12',
        'text-text-3 text-label1 md:text-heading2',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Tab({ children, className, ...linkProps }: TabProps) {
  return (
    <Link
      activeProps={{ className: TAB_ACTIVE, 'aria-current': 'page' }}
      inactiveProps={{ className: TAB_INACTIVE }}
      className={cn(TAB_BASE, className)}
      {...linkProps}
    >
      {children}
    </Link>
  );
}

Tabs.Tab = Tab;
