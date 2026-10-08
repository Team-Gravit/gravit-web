import { cn } from '@/shared/lib/cn';

/** 월~일 순서의 요일 라벨. 서버 응답(MONDAY~SUNDAY)과 인덱스가 대응된다. */
const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const MAX_BAR_HEIGHT_PX = 130;
const EMPTY_BAR_HEIGHT_PX = 8;

interface WeeklyBarChartProps {
  /** 요일별 완료 레슨 수(월~일, 길이 7). */
  dailyCounts: number[];
}

/**
 * 이번 주 요일별 완료 레슨을 막대로 보여준다. 값이 있으면 main, 0이면 회색 최소 막대.
 * 각 요일은 [개수 · 막대 · 요일] 세로 컬럼이며, 개수는 막대 바로 위에 붙는다(시안).
 */
export function WeeklyBarChart({ dailyCounts }: WeeklyBarChartProps) {
  const maxCount = Math.max(...dailyCounts, 1);

  return (
    // items-end: 막대 높이가 달라도 요일 라벨은 한 줄로 바닥 정렬된다.
    <div className="flex items-end gap-2 md:gap-4 min-h-46">
      {dailyCounts.map((count, index) => {
        const hasValue = count > 0;
        const barHeight = hasValue ? (count / maxCount) * MAX_BAR_HEIGHT_PX : EMPTY_BAR_HEIGHT_PX;

        return (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={cn(
                'text-caption1 md:text-body1-normal',
                hasValue ? 'text-main' : 'text-divider-2',
              )}
            >
              {count}개
            </span>
            <div
              className={cn('w-full rounded-8', hasValue ? 'bg-main' : 'bg-divider-2')}
              style={{ height: `${barHeight}px` }}
            />
            <span className="text-caption1 text-text-2 md:text-body1-normal">
              {WEEKDAY_LABELS[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
