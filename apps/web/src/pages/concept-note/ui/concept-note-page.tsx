import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';

import { ConceptNoteNarrowLayout } from './concept-note-narrow-layout';
import { ConceptNoteWideLayout } from './concept-note-wide-layout';

export interface ConceptNotePageProps {
  unitId: string;
}

/**
 * 시안 LRN-04-WEB 과 LRN-04-MOB 는 배경 · 머리 · 카드가 모두 달라 화면 폭별 레이아웃을 통째로 고른다.
 * 노트 조회와 본문은 두 레이아웃이 `ConceptNoteContent` 로 함께 쓴다.
 */
export function ConceptNotePage({ unitId }: ConceptNotePageProps) {
  const isWide = useIsWideViewport();

  return isWide ? (
    <ConceptNoteWideLayout unitId={unitId} />
  ) : (
    <ConceptNoteNarrowLayout unitId={unitId} />
  );
}
