import { cn } from '@/shared/lib/cn';

interface StatItemProps {
  value: string;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
  className?: string;
}

function StatItem({ value, label, highlight, onClick, className }: StatItemProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center flex-col gap-1 md:bg-bg-2 rounded-xl  md:py-8 flex-1',
        className,
      )}
    >
      <p className={cn('text-headline2 md:text-title1', highlight ? 'text-main' : 'text-text-1')}>
        {value}
      </p>
      <span className="text-text-4 text-caption1 md:text-body2-normal">{label}</span>
    </Component>
  );
}

export default StatItem;
