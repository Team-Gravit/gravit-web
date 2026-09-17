import { cn } from '@/shared/lib/cn';
import { PageHeading } from '@/shared/ui/page-heading';
import { Skeleton } from '@/shared/ui/skeleton';
import { useUnitsInChapter } from '@/entities/learning';

export interface ChapterHeadingProps {
  chapterId: number;
  /** 경로가 있는 넓은 화면에서 활성화한다. */
  withBreadcrumb?: boolean;
  /** 별도 `h1`이 있는 화면에서는 `2`로 낮춘다. */
  headingLevel?: 1 | 2;
  className?: string;
}

/**
 * 조회 실패 표시는 `UnitList`가 담당하므로 데이터가 없으면 중복 오류를 렌더링하지 않는다.
 */
export function ChapterHeading({
  chapterId,
  withBreadcrumb = false,
  headingLevel = 1,
  className,
}: ChapterHeadingProps) {
  const { data, isPending } = useUnitsInChapter(chapterId);

  if (isPending) {
    return (
      <div data-slot="chapter-heading" aria-busy="true" className={cn('flex flex-col', className)}>
        {withBreadcrumb ? <Skeleton className="mb-4 w-40 text-body1-normal" /> : null}
        <Skeleton className="w-48 text-headline2 md:text-title1" />
        <Skeleton className="mt-1 w-full max-w-132 text-label2 md:text-body1-normal" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <PageHeading
      title={data.chapterTitle}
      description={data.chapterDescription}
      headingLevel={headingLevel}
      breadcrumbItems={
        withBreadcrumb
          ? [{ label: '홈', link: { to: '/main' } }, { label: data.chapterTitle }]
          : undefined
      }
      className={className}
    />
  );
}
