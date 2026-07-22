import { cn } from '@/shared/lib/cn';

import ProgressBar from './progress-bar';

interface LabeledProgressBarProps {
  value: number;
  label: string;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export default function LabeledProgressBar({
  value,
  label,
  className,
  barClassName,
  labelClassName,
  valueClassName,
}: LabeledProgressBarProps) {
  return (
    <div className={cn('flex flex-col gap-1 md:gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className={cn('text-heading1', labelClassName)}>{label}</span>

        <span className={cn('text-main text-body1-normal', valueClassName)}>{value}%</span>
      </div>

      <ProgressBar value={value} barClassName={barClassName} />
    </div>
  );
}
