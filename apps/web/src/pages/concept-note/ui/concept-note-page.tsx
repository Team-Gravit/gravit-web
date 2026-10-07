import type { LinkProps } from '@tanstack/react-router';

import { useUnitLessons } from '@/entities/learning';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { SpaceBackground } from '@/shared/ui/layout';
import { PageHeading } from '@/shared/ui/page-heading';
import { PageTitleBar } from '@/widgets/page-title-bar';

import { CONCEPT_NOTE_TITLE, ConceptNoteContent } from './concept-note-content';

// 유닛 상세와 표면을 맞추되, 데스크톱에서는 셸 헤더 뒤까지 배경을 이어 붙인다.
const SURFACE_CLASS =
  'flex min-h-full flex-col md:-mt-(--desktop-header-height) md:pt-(--desktop-header-height)';
const MAIN_CLASS = 'mx-auto w-full max-w-300 flex-1 px-4 py-5 md:px-8 md:pt-5 md:pb-50 xl:px-0';
const PAGE_HEADING_SPACING_CLASS = 'mb-6 md:mb-0';

// 시안의 gray-200(#F2F2F2) 테두리는 같은 값의 bg-2 토큰을 사용한다.
const WIDE_CARD_CLASS =
  'mt-10 flex flex-col gap-8 overflow-hidden rounded-12 border border-bg-2 bg-bg-0 pb-8 shadow-[0px_4px_32px_0px_#00000006]';
// 좁은 화면은 챕터 이름과 노트를 하나의 회색 카드에 이어서 표시한다.
const NARROW_CARD_CLASS = 'flex flex-col gap-4 rounded-12 bg-bg-2 p-4';

export interface ConceptNotePageProps {
  unitId: string;
}

/** 화면 폭에 맞는 탐색 머리와 노트 카드를 조립한다. */
export function ConceptNotePage({ unitId }: ConceptNotePageProps) {
  const isWide = useIsWideViewport();
  const numericUnitId = Number(unitId);
  const { data: unitLessons } = useUnitLessons(numericUnitId);

  const unitDetailLink: LinkProps = { to: '/learning/units/$unitId', params: { unitId } };

  return (
    <SpaceBackground variant="starfield" className={SURFACE_CLASS}>
      <div data-slot="concept-note-page" className="flex min-h-full flex-col">
        {isWide ? null : (
          <PageTitleBar title={CONCEPT_NOTE_TITLE} backTo={unitDetailLink} backIcon="close" />
        )}

        <main className={MAIN_CLASS}>
          {unitLessons ? (
            <PageHeading
              title={unitLessons.unitLabel}
              description={unitLessons.unitDescription}
              headingLevel={isWide ? 1 : 2}
              breadcrumbItems={
                isWide
                  ? [
                      { label: '학습', link: { to: '/learning' } },
                      {
                        label: unitLessons.chapterTitle,
                        link: {
                          to: '/learning/chapters/$chapterId',
                          params: { chapterId: String(unitLessons.chapterId) },
                        },
                      },
                      { label: unitLessons.unitLabel, link: unitDetailLink },
                    ]
                  : undefined
              }
              className={PAGE_HEADING_SPACING_CLASS}
            />
          ) : null}

          {/* 첫 Markdown 제목은 카드 안에서도 노트 본문의 시작으로 유지한다. */}
          {isWide ? (
            <section aria-label={CONCEPT_NOTE_TITLE} className={WIDE_CARD_CLASS}>
              <header className="border-b border-divider-2 bg-bg-1 px-8 pt-5 pb-4">
                <h2 className="text-heading1 text-text-1">{CONCEPT_NOTE_TITLE}</h2>
              </header>
              <div className="px-8">
                <ConceptNoteContent unitId={numericUnitId} size="md" />
              </div>
            </section>
          ) : (
            // 상단 막대가 「개념노트」를 표시하므로 카드에는 챕터 이름만 보탠다.
            <section aria-label={CONCEPT_NOTE_TITLE} className={NARROW_CARD_CLASS}>
              {unitLessons ? (
                <p className="text-label1 font-semibold text-text-3">{unitLessons.chapterTitle}</p>
              ) : null}
              <ConceptNoteContent unitId={numericUnitId} size="sm" />
            </section>
          )}
        </main>
      </div>
    </SpaceBackground>
  );
}
