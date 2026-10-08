import { cn } from '@/shared/lib/cn';
import { Chip, type ChipProps } from '@/shared/ui/chip';
import { Skeleton } from '@/shared/ui/skeleton';

import type { Lesson, LessonStatus } from '../model/lesson';

const STATUS_CHIP: Record<LessonStatus, { variant: ChipProps['variant']; label: string }> = {
  completed: { variant: 'outlined', label: '학습 완료' },
  notStarted: { variant: 'muted', label: '학습 전' },
};

// 행 높이와 여백은 표시와 자리표시가 같아야 목록이 흔들리지 않는다.
const ROW_CLASS =
  'flex w-full items-center gap-5 rounded-8 bg-bg-1 px-4 py-3 md:h-18 md:rounded-12 md:py-3.5';

export interface LessonItemProps {
  lesson: Lesson;
  className?: string;
}

/**
 * 레슨 한 줄을 표시한다. 어디로 이동할지는 이 컴포넌트가 정하지 않으므로 화면이 링크로 감싼다.
 */
export function LessonItem({ lesson, className }: LessonItemProps) {
  const { variant, label } = STATUS_CHIP[lesson.status];

  return (
    <div data-slot="lesson-item" data-status={lesson.status} className={cn(ROW_CLASS, className)}>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1">
        <span className="truncate text-label1 text-text-2 md:text-heading2">{lesson.title}</span>
        <span className="text-label2 text-text-4 md:text-label1">{`${lesson.problemCount}문제`}</span>
      </span>
      <Chip variant={variant}>{label}</Chip>
    </div>
  );
}

export function LessonItemSkeleton({ className }: { className?: string }) {
  return (
    <div data-slot="lesson-item" aria-busy="true" className={cn(ROW_CLASS, className)}>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1">
        <Skeleton className="w-1/2 text-label1 md:text-heading2" />
        <Skeleton className="w-12 text-label2 md:text-label1" />
      </span>
      <Skeleton variant="block" className="h-6 w-20 rounded-full md:h-8 md:w-24" />
    </div>
  );
}
