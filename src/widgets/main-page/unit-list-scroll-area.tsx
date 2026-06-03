import type { UnitProgress } from '@/entities/learning/model/schema';
import UnitList from '@/entities/unit/unit-list';
import ScrollArea from '@/shared/ui/scroll/scroll-area';

export default function UnitListScrollArea({ units }: { units: UnitProgress[] }) {
  return (
    <ScrollArea
      orientation="vertical"
      className="h-[232px] md:h-[184px]"
      viewportClassName="px-3 md:px-5 pb-3 md:pb-5 overscroll-contain"
    >
      <UnitList units={units} />
    </ScrollArea>
  );
}
