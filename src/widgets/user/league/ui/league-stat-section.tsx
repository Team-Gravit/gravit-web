import StatItem from '@/shared/ui/stat/stat-item';

const LeagueStatMock = [
  {
    label: '현재 시즌 순위',
    value: '12위',
    highlight: true,
  },
  {
    label: '3위권 진입',
    value: '14회',
  },
  {
    label: '최고티어',
    value: '실버 I',
  },
];

function LeagueStatSection() {
  return (
    <div className="flex items-center justify-center md:gap-6  md:mb-20">
      {LeagueStatMock.map((stat, index) => (
        <>
          <StatItem key={index} value={stat.value} label={stat.label} highlight={stat.highlight} />
          {index < LeagueStatMock.length - 1 && (
            <div aria-hidden className="md:hidden w-px h-12 shrink-0 bg-divider-1" />
          )}
        </>
      ))}
    </div>
  );
}

export default LeagueStatSection;
