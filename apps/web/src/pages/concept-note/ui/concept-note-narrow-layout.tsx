import type { LinkProps } from '@tanstack/react-router';

import { useUnitLessons } from '@/entities/learning';
import { PageTitleBar } from '@/widgets/page-title-bar';

import { CONCEPT_NOTE_TITLE, ConceptNoteContent } from './concept-note-content';

// 셸의 회색 캔버스(bg-2)를 덮어 흰 바탕 위에 회색 카드가 놓이게 한다.
const SURFACE_CLASS = 'flex min-h-full flex-col bg-bg-0';
// 상단 막대가 「개념노트」를 표시하므로 카드에는 챕터 이름만 보탠다.
const CARD_CLASS = 'flex flex-col gap-4 rounded-12 bg-bg-2 p-4';

export interface ConceptNoteNarrowLayoutProps {
  unitId: string;
}

/**
 * 좁은 화면 (시안 LRN-04-MOB). 하단 탭 없는 전체 화면으로, 닫기 막대 아래 회색 카드에 노트를 그린다.
 * 유닛 머리(`Unit01` · 설명)와 우주 배경은 두지 않는다.
 */
export function ConceptNoteNarrowLayout({ unitId }: ConceptNoteNarrowLayoutProps) {
  const numericUnitId = Number(unitId);
  const { data: unitLessons } = useUnitLessons(numericUnitId);

  const unitDetailLink: LinkProps = { to: '/learning/units/$unitId', params: { unitId } };

  return (
    <div data-slot="concept-note-page" className={SURFACE_CLASS}>
      <PageTitleBar title={CONCEPT_NOTE_TITLE} backTo={unitDetailLink} backIcon="close" />

      <main className="flex-1 px-4 py-5">
        <section aria-label={CONCEPT_NOTE_TITLE} className={CARD_CLASS}>
          {unitLessons ? (
            <p className="text-label1 font-semibold text-text-3">{unitLessons.chapterTitle}</p>
          ) : null}
          <ConceptNoteContent unitId={numericUnitId} size="sm" />
        </section>
      </main>
    </div>
  );
}
