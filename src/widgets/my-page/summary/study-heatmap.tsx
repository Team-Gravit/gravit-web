import { useMemo, useState } from 'react';

import { transformLearningHistoryToHeatmap } from '@/entities/learning/lib/transform-learning-history';
import { useGetMyPageLearningHistory } from '@/shared/api/@generated/mypage-api/mypage-api';
import { cn } from '@/shared/lib/cn';
import CalendarHeatmap from '@/shared/ui/calendar-heatmap/calendar-heatmap';
import { HEATMAP_COLOR_LEVELS } from '@/shared/ui/calendar-heatmap/calendar-heatmap.constants';
import Card from '@/shared/ui/card/card';
import { Dropdown } from '@/shared/ui/dropdown';
import ScrollArea from '@/shared/ui/scroll/scroll-area';

export default function StudyHeatmap({ availableYears }: { availableYears: number[] }) {
  const [selectedYear, setSelectedYear] = useState('2026');

  const { data } = useGetMyPageLearningHistory({
    year: Number(selectedYear),
  });

  const studyData = useMemo(() => {
    if (data?.dailySolvedCounts) return transformLearningHistoryToHeatmap(data.dailySolvedCounts);
    return undefined;
  }, [data?.dailySolvedCounts]);

  const dropdownOptions = availableYears.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  return (
    <Card className="md:px-8 md:py-7 gap-4 bg-white w-full min-w-0 overflow-hidden ">
      <div className="flex justify-between items-center">
        <span className="text-label2 md:text-body1-reading text-text-4">학습 기록</span>

        {dropdownOptions.length > 1 && (
          <Dropdown options={dropdownOptions} value={selectedYear} onChange={setSelectedYear} />
        )}
      </div>
      <div className="bg-divider-1 h-[1px] w-full" />
      <ScrollArea orientation="horizontal">
        {studyData && <CalendarHeatmap values={studyData} range="year" />}
      </ScrollArea>
      <CalendarHeatmapInfo />

      {data && data.peakLearningHour !== -1 && (
        <div className="p-3 md:px-6 md:py-4 rounded-sm md:rounded-lg border border-bg-3 text-text-3 text-caption1">
          {`주로 ${data.peakLearningHour}시에 학습하시네요.`}
        </div>
      )}
    </Card>
  );
}
function CalendarHeatmapInfo() {
  return (
    <div className="w-full flex items-center justify-end text-caption1 md:text-body1-normal text-text-3 gap-2 md:gap-4">
      <span>적음</span>
      <ol key={'heatmap-color-info'} className="flex items-center gap-1 md:gap-2">
        {HEATMAP_COLOR_LEVELS.map((color, index) => (
          <li
            key={index}
            className={cn('size-3 md:size-4 rounded-xs md:rounded-sm bg-bg-1', color)}
          ></li>
        ))}
      </ol>
      <span>많음</span>
    </div>
  );
}
