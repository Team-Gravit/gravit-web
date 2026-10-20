import { getScoreSegments } from '@/entities/interview';

// 세 칸이 하나의 그라디언트를 나눠 갖게 한다. 채운 막대 너비 기준으로 그라디언트를 막대 세 칸 길이로 늘리고,
// background-position 백분율이 (막대 - 이미지) 차이에 곱해지는 점을 이용해 칸 순서만큼 왼쪽으로 민다.
function getSegmentGradientStyle(index: number, fillRatio: number) {
  const segmentCount = 3;
  const ratio = Math.max(fillRatio, 0.01);
  return {
    width: `${fillRatio * 100}%`,
    backgroundSize: `${(segmentCount / ratio) * 100}% 100%`,
    backgroundPosition: `${(index / (segmentCount - ratio)) * 100}% 0`,
  };
}

export interface ItemScoreCardProps {
  label: string;
  score: number;
  maxScore: number;
}

export function ItemScoreCard({ label, score, maxScore }: ItemScoreCardProps) {
  const segments = getScoreSegments(score, maxScore);

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-6 border border-divider-1 bg-bg-1 p-4 md:rounded-8 md:px-6">
      <div className="flex items-center justify-between gap-1">
        <span className="text-label1 text-text-2 md:text-heading2">{label}</span>
        <span className="text-caption1 text-main-1 md:text-label1">{score}점</span>
      </div>
      <div
        role="meter"
        aria-label={`${label} ${score}점 / ${maxScore}점`}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-valuenow={score}
        className="flex flex-col gap-1"
      >
        <div className="flex gap-1.5 md:gap-2">
          {segments.map((segment, index) => (
            <div key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-3 md:h-2">
              <div
                className="h-full rounded-full bg-linear-to-r from-main-end to-[#FF5DE9]"
                style={getSegmentGradientStyle(index, segment.fillRatio)}
              />
            </div>
          ))}
        </div>
        <div aria-hidden className="flex gap-1.5 text-caption2 text-text-4 md:gap-2 md:text-label1">
          {segments.map((segment, index) => (
            // 만점이 3보다 작으면 구간 끝 점수가 겹칠 수 있어 위치를 key로 쓴다.
            <span key={index} className="flex-1 text-right">
              {segment.threshold}점
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
