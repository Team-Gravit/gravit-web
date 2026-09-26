import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

import { useToggleProblemBookmark } from '../api/use-toggle-problem-bookmark';
import { BOOKMARK_ADD_LABEL, BOOKMARK_REMOVE_LABEL } from '../model/constants';

export interface BookmarkToggleProps {
  lessonId: number;
  problemId: number;
  isBookmarked: boolean;
  className?: string;
}

export function BookmarkToggle({
  lessonId,
  problemId,
  isBookmarked,
  className,
}: BookmarkToggleProps) {
  const { toggleBookmark, isPending } = useToggleProblemBookmark({ lessonId });

  return (
    <button
      data-slot="bookmark-toggle"
      type="button"
      disabled={isPending}
      onClick={() => toggleBookmark(problemId, isBookmarked)}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? BOOKMARK_REMOVE_LABEL : BOOKMARK_ADD_LABEL}
      className={cn(
        'shrink-0 cursor-pointer rounded-8 p-1 outline-none disabled:cursor-default',
        'focus-visible:ring-3 focus-visible:ring-purple-200',
        isBookmarked ? 'text-icon-accent' : 'text-icon',
        className,
      )}
    >
      <Icon name={isBookmarked ? 'bookmark-fill' : 'bookmark'} className="size-6 md:size-8" />
    </button>
  );
}
