import { isEmptyConceptNote, useConceptNote } from '@/entities/concept-note';
import { CardRetryStatus, CardStatus } from '@/shared/ui/card';
import { Markdown, type MarkdownProps } from '@/shared/ui/markdown';

import { ConceptNoteSkeleton } from './concept-note-skeleton';

export const CONCEPT_NOTE_TITLE = '개념노트';
const EMPTY_CONCEPT_NOTE_MESSAGE = '아직 개념노트가 없어요.';

export interface ConceptNoteContentProps {
  unitId: number;
  size: NonNullable<MarkdownProps['size']>;
}

/** 조회 상태를 본문 영역 안에서 처리하고 준비된 Markdown을 렌더링한다. */
export function ConceptNoteContent({ unitId, size }: ConceptNoteContentProps) {
  const { data: conceptNote, isPending, isError, refetch } = useConceptNote(unitId);

  if (isPending) {
    return <ConceptNoteSkeleton size={size} />;
  }

  if (isError) {
    return <CardRetryStatus sectionName={CONCEPT_NOTE_TITLE} onRetry={() => void refetch()} />;
  }

  if (isEmptyConceptNote(conceptNote)) {
    return <CardStatus message={EMPTY_CONCEPT_NOTE_MESSAGE} />;
  }

  return <Markdown size={size}>{conceptNote.markdown}</Markdown>;
}
