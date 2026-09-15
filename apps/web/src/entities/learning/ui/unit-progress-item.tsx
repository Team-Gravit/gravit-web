import { cn } from '@/shared/lib/cn';
import { Chip, type ChipProps } from '@/shared/ui/chip';

import {
  formatUnitNumber,
  type UnitProgress,
  type UnitProgressStatus,
} from '../model/unit-progress';

const STATUS_CHIP: Record<UnitProgressStatus, { variant: ChipProps['variant']; label: string }> = {
  completed: { variant: 'outlined', label: '학습 완료' },
  inProgress: { variant: 'filled', label: '학습 중' },
  locked: { variant: 'muted', label: '잠김' },
};

export interface UnitProgressItemProps {
  unit: UnitProgress;
  className?: string;
}

export function UnitProgressItem({ unit, className }: UnitProgressItemProps) {
  const { variant, label } = STATUS_CHIP[unit.status];

  return (
    <li
      data-slot="unit-progress-item"
      data-status={unit.status}
      className={cn(
        'flex w-full items-center gap-5 rounded-4 border border-transparent bg-bg-1 px-3 py-2 text-label2 text-text-1 md:rounded-8 md:px-4 md:py-3 md:text-body1-normal',
        unit.status === 'inProgress' && 'border-main',
        unit.status === 'locked' && 'text-text-4',
        className,
      )}
    >
      <span className="flex items-center gap-4 flex-1">
        <span className="w-12 shrink-0 md:w-15">Unit {formatUnitNumber(unit.order)}</span>
        <span aria-hidden className="h-4.5 w-px bg-divider-1" />
        <span className="min-w-0 flex-1 truncate">{unit.title}</span>
      </span>
      <Chip variant={variant}>{label}</Chip>
    </li>
  );
}
