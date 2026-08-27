import * as RadixScrollArea from '@radix-ui/react-scroll-area';

import { cn } from '@/shared/lib/cn';

export default function ScrollArea({
  children,
  className,
  viewportClassName,
  orientation = 'vertical',
}: {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
  orientation?: 'vertical' | 'horizontal';
}) {
  return (
    <RadixScrollArea.Root className={cn('relative w-full min-w-0 overflow-hidden', className)}>
      <RadixScrollArea.Viewport className="w-full h-full">
        <div className={cn('w-full h-fit pb-3', viewportClassName)}>{children}</div>
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        orientation={orientation}
        className={cn(
          'flex touch-none select-none',
          orientation === 'vertical' ? 'flex-col w-[3px] md:w-[7px]' : 'h-[3px] md:h-[7px]',
        )}
      >
        <RadixScrollArea.Thumb className={'relative rounded-full bg-gray-400'} />
      </RadixScrollArea.Scrollbar>
    </RadixScrollArea.Root>
  );
}
