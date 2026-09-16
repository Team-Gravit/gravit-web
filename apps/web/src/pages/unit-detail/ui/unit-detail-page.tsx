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

/** 목록을 그릴 수 없는 동안 자리표시로 보여줄 레슨 행 수. 시안의 행 수와 맞춘다. */
const LESSON_SKELETON_COUNT = 7;

/**
 * 화면의 바탕면.
 *
 * 별·행성 레이어는 넓은 화면에서만 깐다. 좁은 화면은 이 일러스트가 확대돼 빈 영역만 보이는데
 * 배경 이미지는 그때도 내려받으므로, 보이지도 않는 파일을 모바일이 받지 않게 한다.
 *
 * 넓은 화면의 헤더는 `fixed`라 앱 셸이 콘텐츠 영역에 헤더 높이만큼 위 여백을 준다. 배경은
 * 헤더 뒤까지 이어져야 하므로 그 여백을 음수 마진으로 되돌린 뒤, 같은 크기의 패딩으로 안쪽
 * 내용을 원래 자리에 둔다.
 */
const WIDE_SURFACE_CLASS =
  'min-h-full bg-bg-2 md:-mt-(--desktop-header-height) md:pt-(--desktop-header-height)';

function PageSurface({ isWide, children }: { isWide: boolean; children: ReactNode }) {
  if (!isWide) {
    return <div className="min-h-full bg-bg-2">{children}</div>;
  }

  return (
    <SpaceBackground variant="starfield" className={WIDE_SURFACE_CLASS}>
      {children}
    </SpaceBackground>
  );
}

const CARD_CLASS = 'rounded-8 md:rounded-12';

/**
 * 본문 영역. 좌우 여백과 본문 폭은 메인 화면(MIG-025)과 같은 규칙을 쓴다 — 1200px 컬럼에
 * `xl` 미만에서만 32px 여백을 둔다.
 *
 * 넓은 화면의 위 여백이 20px 인 것은 앱 셸이 이미 헤더 높이만큼 띄워 주기 때문이다.
 * 시안에서 경로·제목 영역이 GNB 바로 아래 20px 에서 시작한다.
 */
const MAIN_CLASS = 'mx-auto w-full max-w-300 flex-1 px-4 py-5 md:px-8 md:pt-5 md:pb-50 xl:px-0';
const SHORTCUT_TITLE_CLASS = 'text-headline1 text-text-2 md:text-title3';

// 카드 여백·높이는 표시와 자리표시가 같은 클래스를 써야 로딩이 끝날 때 내용이 밀리지 않는다.
const CONCEPT_CARD_CLASS = 'h-14 items-center gap-3 bg-purple-100 px-4 md:h-auto md:px-6.5 md:py-8';
const ACTION_CARD_CLASS =
  'h-39 flex-1 flex-col justify-between bg-white px-4 py-3 md:h-auto md:px-8 md:py-7';
const HEADING_BLOCK_CLASS = 'mb-6 md:mb-0';
const LIST_SECTION_CLASS = 'flex flex-1 flex-col gap-4 bg-white p-4 md:min-w-0 md:p-8';
const CONCEPT_ICON_CLASS = 'size-6 md:size-12';
const ACTION_ICON_CLASS = 'size-10 md:size-15';

export interface UnitDetailPageProps {
  unitId: string;
}

/**
 * 유닛 상세. 레슨 목록과 개념노트·북마크·오답노트 진입점을 배치한다.
 *
 * 두 화면 폭의 요소 순서가 같아 레이아웃은 CSS로 나눈다. 다만 경로 표시와 상단 바는 폭에 따라
 * 존재 자체가 달라지므로 `useIsWideViewport`로 가른다.
 */
export function UnitDetailPage({ unitId }: UnitDetailPageProps) {
  const isWide = useIsWideViewport();
  const { data, isPending } = useUnitLessons(Number(unitId));

  if (isPending) {
    return <UnitDetailSkeleton isWide={isWide} />;
  }

  if (!data) {
    // 조회에 실패하면 legacy 와 같이 빈 화면을 둔다. 에러 표시는 전 화면 공통 작업에서 정한다.
    return null;
  }

  const chapterLink: LinkProps = {
    to: '/learning/chapters/$chapterId',
    params: { chapterId: String(data.chapterId) },
  };

  return (
    <PageSurface isWide={isWide}>
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
                    { label: '홈', link: { to: '/main' } },
                    { label: data.chapterTitle, link: chapterLink },
                    { label: data.unitLabel },
                  ]
                : undefined
            }
            className={HEADING_BLOCK_CLASS}
          />

          <div className="md:flex md:gap-6 md:pt-10">
            <aside className="mb-3 flex flex-col gap-3 md:mb-0 md:w-100 md:shrink-0">
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
                  // 시안에는 아이콘이 카드 오른쪽 아래에 놓인다.
                  illustration={
                    <Icon name="bookmark-fill" className={cn(ACTION_ICON_CLASS, 'text-3')} />
                  }
                  className={ACTION_CARD_CLASS}
                />
                <ShortcutCard
                  link={{ to: '/learning/units/$unitId/incorrect-problems', params: { unitId } }}
                  title="오답노트"
                  description="틀린 문제를 복습해요."
                  // 개념노트와 같은 글리프를 색만 달리해 쓴다 (시안에서 확인).
                  illustration={
                    <Icon name="learning-fill" className={cn(ACTION_ICON_CLASS, 'text-3')} />
                  }
                  className={ACTION_CARD_CLASS}
                />
              </div>
            </aside>

            <section className={cn(CARD_CLASS, LIST_SECTION_CLASS)}>
              <h2 className="text-label1 text-text-4 md:text-body1-normal">문제 리스트</h2>
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
          <span className={SHORTCUT_TITLE_CLASS}>{title}</span>
          {description ? (
            <span className="text-label2 text-text-4 md:text-body1-normal">{description}</span>
          ) : null}
        </span>
        <Icon name="chevron-right" size={20} className="shrink-0 text-text-3" />
      </span>
      {illustration ? <span className="mt-auto self-end">{illustration}</span> : null}
    </Link>
  );
}

/** 북마크·오답노트 카드의 자리표시. 표시와 같은 클래스를 써서 높이가 어긋나지 않게 한다. */
function ShortcutCardSkeleton() {
  return (
    <div className={cn(CARD_CLASS, 'flex', ACTION_CARD_CLASS)}>
      <span className="flex w-full flex-col gap-1">
        <Skeleton className="w-20 text-headline1 md:text-title3" />
        <Skeleton className="w-full text-label2 md:text-body1-normal" />
      </span>
      <Skeleton variant="block" className={cn(ACTION_ICON_CLASS, 'mt-auto self-end rounded-4')} />
    </div>
  );
}

function UnitDetailSkeleton({ isWide }: { isWide: boolean }) {
  return (
    <PageSurface isWide={isWide}>
      <div data-slot="unit-detail-page" aria-busy="true" className="flex min-h-full flex-col">
        {/*
          좁은 화면의 상단 바는 챕터명이 도착한 뒤에 그린다. 제목을 모르는 동안 빈 `h1`을 두면
          화면에 이름 없는 heading 이 생겨 자리표시로서도 값이 없다.
        */}
        {isWide ? null : (
          <div aria-hidden className="h-12 shrink-0 border-b border-divider-1 bg-white" />
        )}
        <main className={MAIN_CLASS}>
          {/*
            `Skeleton` 의 text 변형은 inline-block 이라 컨테이너가 flex column 이어야 줄이 쌓인다.
            `PageHeading` 과 같은 배치를 써야 로딩이 끝날 때 아래 내용이 밀리지 않는다.
          */}
          <div className={cn('flex flex-col items-start', HEADING_BLOCK_CLASS)}>
            {/* 넓은 화면에만 경로 표시가 있으므로 그 자리도 넓은 화면에서만 잡는다. */}
            {isWide ? <Skeleton className="mb-4 w-52 text-body1-normal" /> : null}
            <Skeleton className="w-40 text-headline2 md:text-title1" />
            <Skeleton className="mt-1 w-2/3 text-label2 md:text-body1-normal" />
          </div>

          <div className="md:flex md:gap-6 md:pt-10">
            <aside className="mb-3 flex flex-col gap-3 md:mb-0 md:w-100 md:shrink-0">
              <div className={cn(CARD_CLASS, 'flex', CONCEPT_CARD_CLASS)}>
                <Skeleton
                  variant="block"
                  className={cn(CONCEPT_ICON_CLASS, 'shrink-0 rounded-4')}
                />
                <Skeleton className="w-24 text-headline1 md:text-title3" />
              </div>

              <div className="flex gap-3 md:flex-col">
                <ShortcutCardSkeleton />
                <ShortcutCardSkeleton />
              </div>
            </aside>

            <section className={cn(CARD_CLASS, LIST_SECTION_CLASS)}>
              <Skeleton className="w-20 text-label1 md:text-body1-normal" />
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
