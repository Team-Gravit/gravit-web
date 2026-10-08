import type { LinkProps } from '@tanstack/react-router';

import { useUnitLessons } from '@/entities/learning';
import { SpaceBackground } from '@/shared/ui/layout';
import { PageHeading } from '@/shared/ui/page-heading';

import { CONCEPT_NOTE_TITLE, ConceptNoteContent } from './concept-note-content';

// 유닛 상세와 표면을 맞추되, 셸 헤더 뒤까지 배경을 이어 붙인다.
const SURFACE_CLASS =
  'flex min-h-full flex-col -mt-(--desktop-header-height) pt-(--desktop-header-height)';
const MAIN_CLASS = 'mx-auto w-full max-w-300 flex-1 px-8 pt-5 pb-50 xl:px-0';

// 시안의 gray-200(#F2F2F2) 테두리는 같은 값의 bg-2 토큰을 사용한다.
const CARD_CLASS =
  'mt-10 flex flex-col gap-8 overflow-hidden rounded-12 border border-bg-2 bg-bg-0 pb-8 shadow-[0px_4px_32px_0px_#00000006]';

export interface ConceptNoteWideLayoutProps {
  unitId: string;
}

/** 넓은 화면 (시안 LRN-04-WEB). 유닛 상세와 같은 우주 배경 · 경로 · 유닛 머리 아래에 노트 카드를 둔다. */
export function ConceptNoteWideLayout({ unitId }: ConceptNoteWideLayoutProps) {
  const numericUnitId = Number(unitId);
  const { data: unitLessons } = useUnitLessons(numericUnitId);

  const unitDetailLink: LinkProps = { to: '/learning/units/$unitId', params: { unitId } };

  return (
    <SpaceBackground variant="starfield" className={SURFACE_CLASS}>
      <main data-slot="concept-note-page" className={MAIN_CLASS}>
        {unitLessons ? (
          <PageHeading
            title={unitLessons.unitLabel}
            description={unitLessons.unitDescription}
            headingLevel={1}
            breadcrumbItems={[
              { label: '학습', link: { to: '/learning' } },
              {
                label: unitLessons.chapterTitle,
                link: {
                  to: '/learning/chapters/$chapterId',
                  params: { chapterId: String(unitLessons.chapterId) },
                },
              },
              { label: unitLessons.unitLabel, link: unitDetailLink },
            ]}
          />
        ) : null}

        <section aria-label={CONCEPT_NOTE_TITLE} className={CARD_CLASS}>
          <header className="border-b border-divider-2 bg-bg-1 px-8 pt-5 pb-4">
            <h2 className="text-heading1 text-text-1">{CONCEPT_NOTE_TITLE}</h2>
          </header>
          <div className="px-8">
            <ConceptNoteContent unitId={numericUnitId} size="md" />
          </div>
        </section>
      </main>
    </SpaceBackground>
  );
}
