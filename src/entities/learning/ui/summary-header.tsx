import { cn } from '@/shared/lib/cn';
import useResponsive from '@/shared/model/use-responsive';
import type { BreadCrumbItem } from '@/shared/ui/bread-crumb/bread-crumb';
import BreadCrumb from '@/shared/ui/bread-crumb/bread-crumb';

function SummaryHeader({
  title,
  description,
  className,
  breadCrumbItems,
}: {
  title: string;
  description: string;
  className?: string;
  breadCrumbItems?: BreadCrumbItem[];
}) {
  const { isDesktop } = useResponsive();

  return (
    <>
      {breadCrumbItems && isDesktop && <BreadCrumb items={breadCrumbItems} className="mb-4" />}
      <div className={cn('space-y-1 mb-6 md:mb-0', className)}>
        <h3 className="text-headline2 text-text-1 md:text-title1 md:text-text-2">{title}</h3>
        <p className="text-label2 text-text-3 md:text-body1-normal">{description}</p>
      </div>
    </>
  );
}
export default SummaryHeader;
