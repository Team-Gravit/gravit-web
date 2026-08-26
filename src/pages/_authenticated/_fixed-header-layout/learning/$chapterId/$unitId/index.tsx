import { createFileRoute, Link } from '@tanstack/react-router';

import LessonItem from '@/entities/learning/ui/lesson/lesson-item';
import SummaryHeader from '@/entities/learning/ui/summary-header';
import { useGetAllLessonInUnit } from '@/shared/api/@generated/lesson-api/lesson-api';
import { useGetAllUnitInChapter } from '@/shared/api/@generated/unit-api/unit-api';
import BookmarkIcon from '@/shared/assets/_icons/bookmark-icon.svg?react';
import RightArrow from '@/shared/assets/_icons/chevron-right.svg?react';
import SubtractIcon from '@/shared/assets/_icons/primary-subtract-icon.svg?react';
import { formatUnitIndex } from '@/shared/lib/format-unit-index';
import SectionCard from '@/shared/ui/card/section-card';

export const Route = createFileRoute(
  '/_authenticated/_fixed-header-layout/learning/$chapterId/$unitId/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { chapterId, unitId } = Route.useParams();

  const { data: chapterData } = useGetAllUnitInChapter(Number(chapterId));
  const { data } = useGetAllLessonInUnit(Number(unitId));

  if (!chapterData || !data) return null;

  const unitIndex = chapterData.unitDetailResponses.findIndex(
    (u) => u.unitSummaryResponse.unitId === Number(unitId),
  );

  const unitLabel = `Unit${formatUnitIndex(unitIndex)}`;

  return (
    <section className="px-4 py-5 md:px-15 h-full overflow-scroll">
      <SummaryHeader
        breadCrumbItems={[
          { label: '홈', to: '/main' },
          { label: chapterData.chapterSummaryResponse.title, to: `/learning/${chapterId}` },
          { label: unitLabel },
        ]}
        title={unitLabel}
        description={data.unitSummaryResponse.description}
        className="mb-3"
      />

      <div className="md:py-10 md:max-w-300 md:mx-auto md:flex md:gap-6">
        <aside className="space-y-3 mb-3 md:w-100 md:shrink md:min-w-0">
          <Link
            to={'/learning/$chapterId/$unitId/concept-note'}
            params={{ chapterId, unitId }}
            className="h-14 md:h-auto flex items-center gap-3 justify-start px-4 py-3 md:px-6.5 md:py-8 rounded-lg md:rounded-xl bg-[var(--color-purple-100)]"
          >
            <SubtractIcon className="fill-main-1 md:size-8" />
            <span className="text-headline1 md:text-title3 text-text-2 flex-1">개념노트</span>
            <RightArrow />
          </Link>

          <div className="flex items-center gap-3 md:flex-col">
            <UnitActionCard
              to="/learning/$chapterId/$unitId/bookmarked-problems"
              params={{ chapterId, unitId }}
              title="북마크"
              description="북마크한 문제를 풀어요."
              icon={<BookmarkIcon className="md:size-15" />}
            />
            <UnitActionCard
              to="/learning/$chapterId/$unitId/incorrect-problems"
              params={{ chapterId, unitId }}
              title="오답노트"
              description="틀린 문제를 복습해요."
              icon={<SubtractIcon className="fill-[#FFB608] size-10 md:size-15" />}
            />
          </div>
        </aside>

        <SectionCard title="문제 리스트" className="w-full flex-1 shrink-0 md:min-w-100">
          <ul className="flex flex-col gap-3">
            {data.lessonSummaries.map((lesson) => (
              <li key={lesson.lessonId}>
                <LessonItem
                  chapterId={chapterId}
                  lessonId={lesson.lessonId.toString()}
                  unitId={unitId}
                  lessonTitle={lesson.title}
                  isSolved={lesson.isSolved}
                  totalProblem={lesson.totalProblem}
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </section>
  );
}

function UnitActionCard({
  to,
  params,
  title,
  description,
  icon,
}: {
  to: string;
  params: Record<string, string>;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      params={params}
      className="flex-1 w-full md:gap-4 bg-white py-3 px-4 md:px-8 md:py-7 rounded-lg md:rounded-xl h-39 md:h-auto flex flex-col justify-between items-end"
    >
      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-headline1 md:text-title3 text-text-2 flex-1">{title}</span>
          <p className="text-label2 md:text-body1-normal text-text-3">{description}</p>
        </div>
        <RightArrow />
      </div>
      {icon}
    </Link>
  );
}
