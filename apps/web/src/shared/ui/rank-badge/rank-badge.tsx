export interface RankBadgeProps {
  rank: number;
}

/** 순위 리스트 앞머리에 붙는 원형 번호 뱃지. 도메인 무관 표시 프리미티브. */
export function RankBadge({ rank }: RankBadgeProps) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-800">
      <span className="text-body1-normal font-medium text-white">{rank}</span>
    </div>
  );
}
