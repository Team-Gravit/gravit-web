import type { MarkdownProps } from '@/shared/ui/markdown';
import { Skeleton } from '@/shared/ui/skeleton';

// 실제 노트(제목 → 그림·요약 상자 → 소제목과 문단 여러 개 → 표 → 코드)의 순서를 흉내 낸다.
// 노트는 대부분 한 화면보다 길어서, 짧은 자리표시를 두면 로딩이 끝날 때 카드가 크게 늘어난다.
const SECTION_LINE_WIDTHS = [
  ['100%', '94%', '72%'],
  ['100%', '88%', '96%', '60%'],
  ['100%', '82%'],
];

const BODY_TEXT_SIZE = { md: 'body1Reading', sm: 'body2Reading' } as const;

export interface ConceptNoteSkeletonProps {
  size: NonNullable<MarkdownProps['size']>;
}

/** 개념노트 본문 자리표시. 본문과 같은 글자 크기를 써서 줄 높이를 맞춘다. */
export function ConceptNoteSkeleton({ size }: ConceptNoteSkeletonProps) {
  const bodyTextSize = BODY_TEXT_SIZE[size];

  return (
    <div aria-busy="true" aria-label="개념노트 불러오는 중" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton textSize="title3" width="45%" />
        <Skeleton variant="block" width="100%" height={112} className="rounded-8" />
      </div>

      {SECTION_LINE_WIDTHS.map((lineWidths, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-3">
          <Skeleton textSize="heading2" width="55%" />
          <div className="flex flex-col gap-2">
            {lineWidths.map((width, lineIndex) => (
              <Skeleton key={lineIndex} textSize={bodyTextSize} width={width} />
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <Skeleton textSize="heading2" width="40%" />
        <Skeleton variant="block" width="100%" height={150} className="rounded-8" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton textSize="heading2" width="35%" />
        <Skeleton variant="block" width="100%" height={180} className="rounded-8" />
      </div>
    </div>
  );
}
