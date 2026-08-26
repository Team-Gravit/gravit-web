import { cn } from '@/shared/lib/cn';

const mockComparisonData = [
  { id: 1, label: '1주 전 대비', count: 4 },
  { id: 2, label: '2주 전 대비', count: -4 },
  { id: 2, label: '3주 전 대비', count: -4 },
];

export default function WeeklyComparisonList() {
  return (
    <ul className="w-full flex flex-col gap-3">
      {mockComparisonData.map((data) => (
        <ComparisonItem key={data.id} {...data} />
      ))}
    </ul>
  );
}

function ComparisonItem({
  label,
  count,
  unit = '개',
}: {
  label: string;
  count: number;
  unit?: string;
}) {
  return (
    <li className="w-full border border-bg-3 p-3 md:p-4 rounded-sm md:rounded-lg flex items-center justify-between">
      <span className="text-caption1 md:text-body1-normal text-text-3">{label}</span>
      <span
        className={cn(
          'text-label2 md:text-body1-normal font-medium text-main-1',
          count < 0 && 'text-semantic-5',
        )}
      >
        {count >= 0 ? '+' : '-'}4{unit}
      </span>
    </li>
  );
}
