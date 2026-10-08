import { Fragment } from 'react';

import { Link } from '@tanstack/react-router';

import RightArrow from '@/shared/assets/_icons/chevron-right.svg?react';
import { cn } from '@/shared/lib/cn';

type BreadCrumbItem =
  | { label: string; to: string }
  | { label: string; to?: never };

interface BreadCrumbProps {
  items: BreadCrumbItem[];
  className?: string;
}

function BreadCrumb({ items, className }: BreadCrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={cn('flex items-center gap-1', className)}>
      {items.map((item, idx) => (
        <Fragment key={item.label}>
          {item.to ? (
            <Link to={item.to} className="text-body1-normal text-text-3">
              {item.label}
            </Link>
          ) : (
            <span className="text-headline2 text-text-2">{item.label}</span>
          )}
          {idx < items.length - 1 && <RightArrow aria-hidden className="size-4" />}
        </Fragment>
      ))}
    </nav>
  );
}

export type { BreadCrumbItem };
export default BreadCrumb;
