import { useId, useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

export interface AccordionProps extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  title: ReactNode;
  /** 사용하는 화면의 행 높이와 여백에 맞출 때 사용한다. */
  headerClassName?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** 접힌 본문을 DOM에서 제거해 보조 기술에도 숨긴다. */
export function Accordion({
  title,
  headerClassName,
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
        'w-full overflow-hidden rounded-8 border border-transparent bg-white',
        // overflow가 버튼의 링을 자르므로 자식 포커스를 감지해 바깥 컨테이너에 표시한다.
        'has-focus-visible:ring-3 has-focus-visible:ring-purple-200 has-focus-visible:border-transparent',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? contentId : undefined}
        onClick={() => setIsOpen((previous) => !previous)}
        className={cn(
          'flex w-full cursor-pointer items-center text-left focus-visible:outline-none',
          headerClassName,
        )}
      >
        {title}
        <Icon
          name="chevron-down"
          size={20}
          className={cn('text-icon-default transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen ? (
        <div id={contentId} className="flex flex-col gap-2 md:gap-3 px-3 py-3 md:px-4 md:py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
