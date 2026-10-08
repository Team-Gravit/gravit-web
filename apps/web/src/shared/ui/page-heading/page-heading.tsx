import { cn } from '@/shared/lib/cn';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui/breadcrumb';

export interface PageHeadingProps {
  title: string;
  description?: string;
  /** 경로가 없는 레이아웃에서는 생략한다. */
  breadcrumbItems?: BreadcrumbItem[];
  /** 다른 영역이 `h1`을 제공하면 `2`로 낮춘다. */
  headingLevel?: 1 | 2;
  className?: string;
}

export function PageHeading({
  title,
  description,
  breadcrumbItems,
  headingLevel = 1,
  className,
}: PageHeadingProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

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
