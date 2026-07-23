import { createFileRoute, Link } from '@tanstack/react-router';

import SummaryHeader from '@/entities/learning/ui/summary-header';
import { useGetAllUnitInChapter } from '@/shared/api/@generated/unit-api/unit-api';
import RightArrow from '@/shared/assets/_icons/chevron-right.svg?react';
import { formatUnitIndex } from '@/shared/lib/format-unit-index';
import ProgressBar from '@/shared/ui/progress-bar/progress-bar';
export const Route = createFileRoute('/_authenticated/_fixed-header-layout/learning/$chapterId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { chapterId } = Route.useParams();

  const { data } = useGetAllUnitInChapter(Number(chapterId));

  // TODO : skeleton 적용
  if (!data) return null;

  const { chapterSummaryResponse, unitDetailResponses } = data;

  return (
    <section className="h-full overflow-scroll px-4 py-5 md:px-15">
      <SummaryHeader
        breadCrumbItems={[{ label: '홈', to: '/main' }, { label: chapterSummaryResponse.title }]}
        title={chapterSummaryResponse.title}
        description={chapterSummaryResponse.description}
      />

      <ol className="flex flex-col gap-3 items-center justify-center overflow-visible mx-auto md:pt-10">
        {unitDetailResponses.map(({ progressRate, unitSummaryResponse }, idx) => (
          <UnitListItem
            key={unitSummaryResponse.unitId}
            title={unitSummaryResponse.title}
            description={unitSummaryResponse.description}
            unitId={unitSummaryResponse.unitId.toString()}
            chapterId={chapterId}
            unitIndex={formatUnitIndex(idx)}
            progressRate={progressRate}
          />
        ))}
      </ol>
    </section>
  );
}

function UnitListItem({
  unitId,
  chapterId,
  title,
  description,
  progressRate,
  unitIndex,
}: {
  unitId: string;
  chapterId: string;
  title: string;
  description: string;
  progressRate: number;
  unitIndex: string;
}) {
  return (
    <li className="bg-white max-w-300 w-full rounded-lg md:rounded-xl px-4 py-3 md:p-8 flex flex-col gap-1 transition-all hover:scale-105 hover:bg-[var(--color-purple-100)] hover:drop-shadow-[0_0_6px_var(--color-main-1)]">
      <Link
        to={`/learning/$chapterId/$unitId`}
        params={{ chapterId, unitId }}
        className="flex justify-between items-center relative md:gap-6"
      >
        <div className="flex-1">
          <div className="space-y-1 mb-1 md:space-y-0 md:mb-4">
            <h5 className="text-headline2 md:text-heading2 text-text-2">{`Unit${unitIndex} - ${title}`}</h5>
            <p className="text-label2 md:text-label1 text-text-4">{description}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-headline2 md:text-heading2 text-text-4 w-10 shrink-0">{`${progressRate}%`}</span>
            <ProgressBar value={progressRate} className="bg-bg-3" />
          </div>
        </div>

        <RightArrow className="absolute top-0 right-0 md:static" />
      </Link>
    </li>
  );
}
