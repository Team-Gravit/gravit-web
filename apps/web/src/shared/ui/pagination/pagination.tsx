import { cva } from 'class-variance-authority';

import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

import { getPaginationRange } from './get-pagination-range';

export interface PaginationProps {
  /** 현재 페이지 (1-based). 서버 응답의 `page`를 그대로 넘긴다. */
  currentPage: number;
  /** 전체 페이지 수. 서버 응답의 `totalPages`를 그대로 넘긴다. */
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 페이지 번호 목록과 이전/다음 이동을 제공한다. 페이지 상태는 호출부가 소유하고
 * `onPageChange`로 바뀐 페이지를 알린다.
 *
 * 좁은 화면은 이동 버튼을 아이콘만으로 좁게 보여주고 주변 페이지 수도 줄인다.
 */
export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const isWide = useIsWideViewport();
  const items = getPaginationRange({ currentPage, totalPages, siblingCount: isWide ? 2 : 1 });

  // 한 페이지뿐이면 이동할 곳이 없다.
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="페이지 목록"
      data-slot="pagination"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      <EdgeButton
        direction="prev"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      <ul className="flex items-center gap-1 md:gap-2">
        {items.map((item, index) => (
          <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <span
                aria-hidden
                className="flex size-7 items-center justify-center text-text-3 md:size-10"
              >
                <Icon name="more-horizontal" className="size-6" />
              </span>
            ) : (
              <PageButton
                page={item}
                isActive={item === currentPage}
                onClick={() => onPageChange(item)}
              />
            )}
          </li>
        ))}
      </ul>

      <EdgeButton
        direction="next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

const pageButtonClassName = cva(
  'flex size-7 cursor-pointer items-center justify-center rounded-6 text-body1-normal md:size-10',
  {
    variants: {
      isActive: {
        true: 'border border-main bg-purple-50 text-main',
        false: 'text-text-3',
      },
    },
  },
);

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${page} 페이지`}
      aria-current={isActive ? 'page' : undefined}
      className={cn(pageButtonClassName({ isActive }))}
    >
      {page}
    </button>
  );
}

interface EdgeButtonProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}

function EdgeButton({ direction, disabled, onClick }: EdgeButtonProps) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={isPrev ? '이전 페이지' : '다음 페이지'}
      className={cn(
        'flex h-10 cursor-pointer items-center gap-1 rounded-6 text-body1-normal text-text-3',
        'disabled:pointer-events-none disabled:opacity-40',
        isPrev ? 'md:pr-2 md:pl-1' : 'md:pr-1 md:pl-2',
      )}
    >
      {isPrev && <Icon name="chevron-left" className="size-6 md:size-5" />}
      <span className="hidden md:inline">{isPrev ? '이전' : '다음'}</span>
      {!isPrev && <Icon name="chevron-right" className="size-6 md:size-5" />}
    </button>
  );
}
