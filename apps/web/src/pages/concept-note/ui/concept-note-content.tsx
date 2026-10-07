import { isEmptyConceptNote, useConceptNote } from '@/entities/concept-note';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { Markdown, type MarkdownProps } from '@/shared/ui/markdown';
import { Skeleton } from '@/shared/ui/skeleton';

export const CONCEPT_NOTE_TITLE = '개념노트';
const EMPTY_CONCEPT_NOTE_MESSAGE = '아직 개념노트가 없어요.';

// 첫 화면의 문단 밀도를 유지해 로딩 전후 레이아웃 변화를 줄인다.
const SKELETON_LINE_WIDTHS = ['100%', '92%', '96%', '70%', '100%', '84%'];

export interface ConceptNoteContentProps {
  unitId: number;
  size: MarkdownProps['size'];
}

/** 조회 상태를 본문 영역 안에서 처리하고 준비된 Markdown을 렌더링한다. */
export function ConceptNoteContent({ unitId, size }: ConceptNoteContentProps) {
  const { data: conceptNote, isPending, isError, refetch } = useConceptNote(unitId);

  if (isPending) {
    return (
      <div aria-busy="true" aria-label="개념노트 불러오는 중" className="flex flex-col gap-2">
        {SKELETON_LINE_WIDTHS.map((width, index) => (
          <Skeleton key={index} textSize="body1Reading" width={width} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <CardRetryStatus sectionName={CONCEPT_NOTE_TITLE} onRetry={() => void refetch()} />;
  }

  if (isEmptyConceptNote(conceptNote)) {
    return <CardStatus message={EMPTY_CONCEPT_NOTE_MESSAGE} />;
  }

  return <Markdown size={size}>{conceptNote.markdown}</Markdown>;
}
