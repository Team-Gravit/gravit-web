import { cn } from '@/shared/lib/cn';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui/breadcrumb';

export interface PageHeadingProps {
  title: string;
  description?: string;
  /** 좁은 화면에는 경로가 없으므로 반응형 페이지에서는 넓은 화면에만 전달합니다. */
  breadcrumbItems?: BreadcrumbItem[];
  className?: string;
}

/**
 * 콘텐츠 영역 상단에서 경로·제목·설명을 함께 표시합니다. 제목이 중복되지 않도록 좁은 화면용
 * `PageTitleBar`와 동시에 렌더링하지 않습니다.
 */
export function PageHeading({ title, description, breadcrumbItems, className }: PageHeadingProps) {
  return (
    <div data-slot="page-heading" className={cn('flex flex-col', className)}>
      {breadcrumbItems ? <Breadcrumb items={breadcrumbItems} className="mb-4" /> : null}
      <h1 className="text-headline2 text-text-1 md:text-title1 md:text-text-2">{title}</h1>
      {description ? (
        <p className="mt-1 text-label2 text-text-3 md:text-body1-normal">{description}</p>
      ) : null}
    </div>
  );
}
