import { cn } from '@/shared/lib/cn';

import UnitStatusChip from './unit-status-chip';

interface UnitItemProps {
  unitId: number;
  unitTitle: string;
  unitStatus: 'completed' | 'inProgress' | 'notStarted';
}

export default function UnitItem({ unitId, unitTitle, unitStatus }: UnitItemProps) {
  return (
    <div
      className={cn(
        'w-full flex items-center px-3 py-2 md:px-4 md:py-3 rounded-sm md:rounded-lg bg-gray-100 border border-transparent',
        unitStatus === 'inProgress' && ' border-[#CE4BFF]',
      )}
    >
      <span
        className={cn(
          'inline-block w-12 md:w-[60px] text-gray-900 md:text-base text-sm md:font-medium',
          unitStatus === 'notStarted' && 'text-gray-400',
        )}
      >
        Unit {unitId.toString().padStart(2, '0')}
      </span>
      <div className="h-[18px] w-0.5 bg-gray-300 mx-4" />
      <div
        className={cn(
          'text-gray-900 flex-1  line-clamp-1 mr-5',
          unitStatus === 'notStarted' && 'text-gray-400',
        )}
      >
        {unitTitle}
      </div>
      <UnitStatusChip status={unitStatus} size="lg" />
    </div>
  );
}
