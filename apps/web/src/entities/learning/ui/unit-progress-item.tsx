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

const LONGEST_STATUS_LABEL = Object.values(STATUS_CHIP).reduce(
  (longest, { label }) => (label.length > longest.length ? label : longest),
  '',
);

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
      {/* 가장 긴 상태 문구를 보이지 않는 가상 요소로 같은 칸에 겹쳐 칩 폭을 그 문구에 맞춘다.
          행마다 제목 칸 너비가 같아지고, 칩 크기가 화면 폭에 따라 바뀌어도 폭이 남거나 모자라지 않는다.
          가상 요소라 행의 텍스트와 스크린리더에는 잡히지 않는다. */}
      <Chip variant={variant}>
        <span
          data-width-label={LONGEST_STATUS_LABEL}
          className="grid justify-items-center after:invisible after:col-start-1 after:row-start-1 after:content-[attr(data-width-label)]"
        >
          <span className="col-start-1 row-start-1">{label}</span>
        </span>
      </Chip>
    </li>
  );
}
