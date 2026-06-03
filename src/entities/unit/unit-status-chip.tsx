import Chip from '@/shared/ui/chip/chip';

type UnitStatus = 'completed' | 'inProgress' | 'notStarted';

const STATUS_CONFIG: Record<
  UnitStatus,
  { variant: 'filled' | 'outlined' | 'muted'; label: string }
> = {
  completed: { variant: 'outlined', label: '완료' },
  inProgress: { variant: 'filled', label: '진행 중' },
  notStarted: { variant: 'muted', label: '잠김' },
};

interface UnitStatusChipProps {
  status: UnitStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function UnitStatusChip({ status, size }: UnitStatusChipProps) {
  const { variant, label } = STATUS_CONFIG[status];
  return (
    <Chip variant={variant} size={size}>
      {label}
    </Chip>
  );
}
