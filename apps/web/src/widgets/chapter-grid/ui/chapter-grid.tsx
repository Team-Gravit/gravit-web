import { cn } from '@/shared/lib/cn';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { ChapterCard, ChapterCardSkeleton, useChapters } from '@/entities/learning';

/** 가장 넓은 4열에서 두 줄을 채워 로딩 중에도 목록 영역의 높이를 유지한다. */
const SKELETON_CARD_COUNT = 8;

/** 페이지 분기점(768px)을 지나더라도 600~1199px 구간은 3열을 유지한다. */
const GRID_LAYOUT_CLASS =
  'grid grid-cols-2 gap-3 min-[600px]:grid-cols-3 min-[600px]:gap-4.5 min-[1200px]:grid-cols-4 min-[1200px]:gap-6';

export interface ChapterGridProps {
  /** 카드 표현만 선택한다. 그리드 열 수는 뷰포트 너비로 결정된다. */
  size?: 'lg' | 'sm';
  className?: string;
}

/** 챕터 목록을 조회해 카드 그리드로 배치한다. 로딩·빈 목록·실패를 스스로 처리한다. */
export function ChapterGrid({ size = 'sm', className }: ChapterGridProps) {
  const { data: chapters, isPending, isError, refetch } = useChapters();

  if (isPending) {
    return (
      <div data-slot="chapter-grid" aria-busy="true" className={cn(GRID_LAYOUT_CLASS, className)}>
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <ChapterCardSkeleton key={index} size={size} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div data-slot="chapter-grid-status" className={cn('flex min-h-40', className)}>
        <CardRetryStatus sectionName="챕터 목록" onRetry={() => void refetch()} />
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div data-slot="chapter-grid-status" className={cn('flex min-h-40', className)}>
        <CardStatus message="챕터가 없습니다." />
      </div>
    );
  }

  return (
    <div data-slot="chapter-grid" className={cn(GRID_LAYOUT_CLASS, className)}>
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.chapterId}
          size={size}
          chapterId={chapter.chapterId}
          title={chapter.title}
          description={chapter.description}
          progressPercent={chapter.progressPercent}
        />
      ))}
    </div>
  );
}
