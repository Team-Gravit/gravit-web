import { Link, type LinkProps } from '@tanstack/react-router';
import React, { type ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

interface BaseTabProps {
  className?: string;
  children: React.ReactNode;
}

type ButtonTabProps = BaseTabProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active: boolean;
    as: 'button';
  };

type LinkTabProps = BaseTabProps &
  LinkProps & {
    as: 'link';
  };

type TabProps = ButtonTabProps | LinkTabProps;

export default function Tabs({ children, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center w-full gap-1 p-1 md:gap-2 md:p-2 bg-text-1-w rounded-lg md:rounded-xl text-text-3 label1 md:heading2',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Tab(props: TabProps) {
  const tabActiveStyle = 'bg-[var(--primitive-purple-700)] text-text-1-w';
  const tabInActiveStyle = 'bg-transparent';

  const baseTabStyle = cn(
    'block flex-1 text-center py-2.5 md:py-4 rounded-sm md:rounded-lg transition-colors',
  );

  if (props.as === 'link') {
    const { as, to, children, ...linkProps } = props;

    return (
      <Link
        to={to}
        activeProps={{ className: tabActiveStyle, 'aria-current': 'page' }}
        inactiveProps={{ className: tabInActiveStyle }}
        className={baseTabStyle}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  if (props.as === 'button') {
    const { as, active, children, ...buttonProps } = props;

    return (
      <button
        type="button"
        className={cn(baseTabStyle, active ? tabActiveStyle : tabInActiveStyle)}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}
Tabs.Tab = Tab;
