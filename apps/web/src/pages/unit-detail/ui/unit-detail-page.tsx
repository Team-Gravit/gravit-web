import type { ReactNode } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';

import { LessonItem, LessonItemSkeleton, useUnitLessons } from '@/entities/learning';
import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Icon } from '@/shared/ui/icon';
import { SpaceBackground } from '@/shared/ui/layout';
import { PageHeading } from '@/shared/ui/page-heading';
import { Skeleton } from '@/shared/ui/skeleton';
import { PageTitleBar } from '@/widgets/page-title-bar';

// 서버가 유닛마다 레슨 세 개를 제공하므로 로딩 상태도 같은 수를 유지한다.
const LESSON_SKELETON_COUNT = 3;

// 데스크톱은 셸의 헤더 여백을 상쇄해 배경만 `fixed` 헤더 뒤까지 확장한다.
const SURFACE_CLASS =
  'flex min-h-full flex-col md:-mt-(--desktop-header-height) md:pt-(--desktop-header-height)';

function PageSurface({ children }: { children: ReactNode }) {
  return (
    <SpaceBackground variant="starfield" className={SURFACE_CLASS}>
      {children}
    </SpaceBackground>
  );
}

const CARD_CLASS =
  'rounded-8 border border-card-border shadow-[0px_4px_32px_0px_#00000010] md:rounded-12';

// 앱 셸이 헤더 높이를 이미 확보하므로 데스크톱에서는 추가 상단 여백만 둔다.
const MAIN_CLASS = 'mx-auto w-full max-w-300 flex-1 px-4 py-5 md:px-8 md:pt-5 md:pb-50 xl:px-0';
const SHORTCUT_CARD_TITLE_CLASS = 'text-headline1 text-text-2 md:text-title3';

// 카드 여백·높이는 표시와 자리표시가 같은 클래스를 써야 로딩이 끝날 때 내용이 밀리지 않는다.
const CONCEPT_CARD_CLASS = 'h-14 items-center gap-3 bg-purple-100 px-4 md:h-auto md:px-6.5 md:py-8';
const ACTION_CARD_CLASS =
  'h-39 flex-1 flex-col justify-between bg-white px-4 py-3 md:h-auto md:px-8 md:py-7';
// 좁은 화면의 제목 아래 여백이며, 데스크톱 간격은 다음 영역의 `pt-10`이 맡는다.
const PAGE_HEADING_SPACING_CLASS = 'mb-6 md:mb-0';
const SHORTCUT_COLUMN_CLASS =
  'mb-3 flex flex-col gap-3 md:mb-0 md:w-1/3 md:min-w-80 md:max-w-100 md:shrink-0';
const LIST_SECTION_CLASS =
  'flex flex-1 flex-col gap-3 bg-white px-4 py-3 md:min-w-0 md:p-8 min-h-50';
const CONCEPT_ICON_CLASS = 'size-8 md:size-12';
const ACTION_ICON_CLASS = 'size-10 md:size-15';
const SHORTCUT_CHEVRON_SIZE_CLASS = 'size-6 shrink-0 md:size-5';

export interface UnitDetailPageProps {
  unitId: string;
}

export function UnitDetailPage({ unitId }: UnitDetailPageProps) {
  const isWide = useIsWideViewport();
  const { data, isPending } = useUnitLessons(Number(unitId));

  if (isPending) {
    return <UnitDetailSkeleton isWide={isWide} />;
  }

  // 조회가 실패하면 화면을 그리지 않는다. 공통 에러 표시가 생기면 그쪽이 맡는다.
  if (!data) {
    return null;
  }

  const chapterLink: LinkProps = {
    to: '/learning/chapters/$chapterId',
    params: { chapterId: String(data.chapterId) },
  };

  return (
    <PageSurface>
      <div data-slot="unit-detail-page" className="flex min-h-full flex-col">
        {isWide ? null : <PageTitleBar title={data.chapterTitle} backTo={chapterLink} />}

        <main className={MAIN_CLASS}>
          <PageHeading
            title={data.unitLabel}
            description={data.unitDescription}
            headingLevel={isWide ? 1 : 2}
            breadcrumbItems={
              isWide
                ? [
                    { label: '학습', link: { to: '/learning' } },
                    { label: data.chapterTitle, link: chapterLink },
                    { label: data.unitLabel },
                  ]
                : undefined
            }
            className={PAGE_HEADING_SPACING_CLASS}
          />

          <div className="md:flex md:gap-6 md:pt-10">
            <aside className={SHORTCUT_COLUMN_CLASS}>
              <ShortcutCard
                link={{ to: '/learning/units/$unitId/concept-note', params: { unitId } }}
                title="개념노트"
                icon={<Icon name="learning-fill" className={cn(CONCEPT_ICON_CLASS, 'text-main')} />}
                className={CONCEPT_CARD_CLASS}
              />

              <div className="flex gap-3 md:flex-col">
                <ShortcutCard
                  link={{ to: '/learning/units/$unitId/bookmarked-problems', params: { unitId } }}
                  title="북마크"
                  description="북마크한 문제를 풀어요."
                  illustration={
                    <Icon
                      name="bookmark-fill"
                      className={cn(ACTION_ICON_CLASS, 'text-icon-accent')}
                    />
                  }
                  className={ACTION_CARD_CLASS}
                />
                <ShortcutCard
                  link={{ to: '/learning/units/$unitId/incorrect-problems', params: { unitId } }}
                  title="오답노트"
                  description="틀린 문제를 복습해요."
                  // 시안은 오답노트에 개념노트와 같은 글리프를 다른 색으로 쓴다.
                  illustration={
                    <Icon
                      name="learning-fill"
                      className={cn(ACTION_ICON_CLASS, 'text-icon-accent')}
                    />
                  }
                  className={ACTION_CARD_CLASS}
                />
              </div>
            </aside>

            <section className={cn(CARD_CLASS, LIST_SECTION_CLASS)}>
              <h2 className="text-label2 text-text-4 md:text-body1-normal">문제 리스트</h2>
              {data.lessons.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {data.lessons.map((lesson) => (
                    <li key={lesson.lessonId}>
                      <Link
                        to="/learning/lessons/$lessonId"
                        params={{ lessonId: String(lesson.lessonId) }}
                        className="block rounded-8 outline-none focus-visible:ring-3 focus-visible:ring-purple-200"
                      >
                        <LessonItem lesson={lesson} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-1">
                  <p
                    role="status"
                    className="text-center text-label1 text-text-4 md:text-headline1"
                  >
                    아직 등록된 레슨이 없어요.
                    <br />곧 새로운 레슨이 추가될 예정이에요.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </PageSurface>
  );
}

interface ShortcutCardProps {
  link: LinkProps;
  title: string;
  description?: string;
  /** 제목 왼쪽에 놓는 아이콘. 개념노트처럼 한 줄로 배치하는 카드가 쓴다. */
  icon?: ReactNode;
  /** 카드 아래쪽에 놓는 큰 아이콘. */
  illustration?: ReactNode;
  className?: string;
}

function ShortcutCard({
  link,
  title,
  description,
  icon,
  illustration,
  className,
}: ShortcutCardProps) {
  return (
    <Link
      {...link}
      data-slot="shortcut-card"
      className={cn(
        CARD_CLASS,
        'flex outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
        className,
      )}
    >
      <span className={cn('flex w-full items-start justify-between gap-3', icon && 'items-center')}>
        {icon}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center justify-between">
            <span className={SHORTCUT_CARD_TITLE_CLASS}>{title}</span>
            <Icon name="chevron-right" className={cn(SHORTCUT_CHEVRON_SIZE_CLASS, 'text-text-3')} />
          </span>
          {description ? (
            <span className="text-label2 text-text-3 md:text-text-4 md:text-body1-normal">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      {illustration ? <span className="self-end">{illustration}</span> : null}
    </Link>
  );
}

function ShortcutCardSkeleton() {
  return (
    <div className={cn(CARD_CLASS, 'flex', ACTION_CARD_CLASS)}>
      <span className="flex w-full flex-col gap-1">
        <span className="flex items-center justify-between gap-3">
          <Skeleton className="w-20 text-headline1 md:text-title3" />
          <Skeleton variant="block" className={cn(SHORTCUT_CHEVRON_SIZE_CLASS, 'rounded-4')} />
        </span>
        <Skeleton className="w-full text-label2 md:text-body1-normal" />
      </span>
      <Skeleton variant="block" className={cn(ACTION_ICON_CLASS, 'self-end rounded-4')} />
    </div>
  );
}

function UnitDetailSkeleton({ isWide }: { isWide: boolean }) {
  return (
    <PageSurface>
      <div data-slot="unit-detail-page" aria-busy="true" className="flex min-h-full flex-col">
        {/* 챕터명이 없을 때 이름 없는 `h1`을 만들지 않는다. */}
        {isWide ? null : (
          <div aria-hidden className="h-12 shrink-0 border-b border-divider-1 bg-white" />
        )}
        <main className={MAIN_CLASS}>
          {/* text 스켈레톤은 inline-block이라 flex column으로 쌓아야 한다. */}
          <div className={cn('flex flex-col items-start', PAGE_HEADING_SPACING_CLASS)}>
            {isWide ? <Skeleton className="mb-4 w-52 text-body1-normal" /> : null}
            <Skeleton className="w-40 text-headline2 md:text-title1" />
            <Skeleton className="mt-1 w-2/3 text-label2 md:text-body1-normal" />
          </div>

          <div className="md:flex md:gap-6 md:pt-10">
            <aside className={SHORTCUT_COLUMN_CLASS}>
              <div className={cn(CARD_CLASS, 'flex', CONCEPT_CARD_CLASS)}>
                <Skeleton
                  variant="block"
                  className={cn(CONCEPT_ICON_CLASS, 'shrink-0 rounded-4')}
                />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <Skeleton className="w-24 text-headline1 md:text-title3" />
                  <Skeleton
                    variant="block"
                    className={cn(SHORTCUT_CHEVRON_SIZE_CLASS, 'rounded-4')}
                  />
                </span>
              </div>

              <div className="flex gap-3 md:flex-col">
                <ShortcutCardSkeleton />
                <ShortcutCardSkeleton />
              </div>
            </aside>

            <section className={cn(CARD_CLASS, LIST_SECTION_CLASS)}>
              <Skeleton className="w-20 text-label2 md:text-body1-normal" />
              <div className="flex flex-col gap-3">
                {Array.from({ length: LESSON_SKELETON_COUNT }, (_, index) => (
                  <LessonItemSkeleton key={index} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </PageSurface>
  );
}
