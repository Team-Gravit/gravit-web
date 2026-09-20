import { useId, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

export interface AccordionProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * 머리말을 눌러 본문을 여닫는 컴포넌트
 *
 * - 접힌 동안 본문은 DOM에 없다. 보조기술이 숨은 내용을 읽지 않게 하기 위함
 */
export function Accordion({
  title,
  defaultOpen = false,
  children,
  className,
  ...props
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      data-slot="accordion"
      data-open={isOpen || undefined}
      className={cn(
        'w-full overflow-hidden rounded-8 border border-transparent',
        'has-focus-visible:ring-3 has-focus-visible:ring-purple-200 has-focus-visible:border-transparent', // 링이 존재하면 테두리 제거
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? contentId : undefined}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full cursor-pointer items-center p-3 md:p-4 text-left focus-visible:outline-none"
      >
        <span className="min-w-0 flex-1 flex items-center justify-start gap-3 md:gap-4">
          {title}
        </span>
        <Icon
          name="chevron-down"
          size={20}
          className={cn('text-icon-default transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen ? (
        <div id={contentId} className="flex flex-col gap-2 md:gap-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
