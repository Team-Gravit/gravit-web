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
  notStarted: { variant: 'muted', label: '학습 전' },
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
        unit.status === 'notStarted' && 'text-text-4',
        className,
      )}
    >
      {/* min-w-0 이 없으면 flex 항목이 제목 전체 길이보다 줄어들지 않아 말줄임 대신 행 밖으로 넘친다. */}
      <span className="flex min-w-0 flex-1 items-center gap-4">
        <span className="w-12 shrink-0 md:w-15">Unit {formatUnitNumber(unit.order)}</span>
        <span aria-hidden className="h-4.5 w-px shrink-0 bg-divider-1" />
        <span className="min-w-0 flex-1 truncate">{unit.title}</span>
      </span>
      {/* 칩 폭을 가장 긴 문구(학습 완료)에 맞춰 고정해 행마다 제목 칸 너비가 같게 한다.
          좁아지거나 목록에 스크롤 막대가 생겨도 열이 어긋나지 않는다. */}
      <Chip variant={variant} className="min-w-20">
        {label}
      </Chip>
    </li>
  );
}
