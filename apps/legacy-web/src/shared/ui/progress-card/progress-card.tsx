import { cn } from '@/shared/lib/cn';

import ProgressBar from '../progress-bar/progress-bar';

type Props = {
  leftSlot: React.ReactNode;
  value: number;
  max: number;
  unit: string;
  className?: string;
};

export const ProgressCard = ({ leftSlot, value, max, unit, className }: Props) => (
  <div className={cn('flex min-w-0 flex-col gap-2', className)}>
    <div className="flex min-w-0 items-center justify-between gap-2">
      <div className="min-w-0">{leftSlot}</div>
      <span className="shrink-0 whitespace-nowrap text-text-4 text-body1-normal">
        <span className="text-main">{value}</span> / {max} {unit}
      </span>
    </div>
    <ProgressBar value={Math.floor((value / max) * 100)} />
  </div>
);
