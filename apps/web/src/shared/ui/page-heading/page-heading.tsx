import { cn } from '@/shared/lib/cn';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui/breadcrumb';

export interface PageHeadingProps {
  title: string;
  description?: string;
  /** 좁은 화면에는 경로가 없으므로 반응형 페이지에서는 넓은 화면에만 전달합니다. */
  breadcrumbItems?: BreadcrumbItem[];
  /**
   * 제목의 heading 수준입니다. 기본값은 `1`입니다.
   *
   * 좁은 화면에서 `PageTitleBar`와 함께 쓰는 화면은 그쪽이 `h1`을 가지므로 `2`를 전달해
   * 한 화면에 `h1`이 둘 생기지 않게 합니다.
   */
  headingLevel?: 1 | 2;
  className?: string;
}

/**
 * 콘텐츠 영역 상단에서 경로·제목·설명을 함께 표시합니다.
 *
 * 좁은 화면용 `PageTitleBar`와 함께 쓸 수 있으며, 그때는 `headingLevel`을 `2`로 낮춥니다.
 */
export function PageHeading({
  title,
  description,
  breadcrumbItems,
  headingLevel = 1,
  className,
}: PageHeadingProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h1';

  return (
    <div data-slot="page-heading" className={cn('flex flex-col', className)}>
      {breadcrumbItems ? <Breadcrumb items={breadcrumbItems} className="mb-4" /> : null}
      <Heading className="text-headline2 text-text-1 md:text-title1 md:text-text-2">
        {title}
      </Heading>
      {description ? (
        <p className="mt-1 text-label2 text-text-3 md:text-body1-normal">{description}</p>
      ) : null}
    </div>
  );
}
