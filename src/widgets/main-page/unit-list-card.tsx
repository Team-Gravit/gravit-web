import type { UnitProgress } from '@/entities/learning/model/schema';
import { LinkButton } from '@/shared/ui/button/link-button';
import Card from '@/shared/ui/card/card';
import LabeledProgressBar from '@/shared/ui/progress-bar/labeled-progress-bar';
import ProgressBar from '@/shared/ui/progress-bar/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

import UnitListScrollArea from './unit-list-scroll-area';

type UnitListCardProps = {
  chapterId?: number;
  chapterTitle?: string;
  chapterProgressRate?: number;
  units?: UnitProgress[];
  isLoading?: boolean;
};

export default function UnitListCard({
  chapterId = 0,
  chapterTitle = '',
  chapterProgressRate = 0,
  units = [],
  isLoading = false,
}: UnitListCardProps) {
  const nextUnit = units.find((u) => !u.isCompleted);

  return (
    <Card className="px-0 md:px-0">
      <Card.Header className="min-h-[19px] px-3 md:min-h-6 md:px-5">
        <Card.Title>이어서 학습하기</Card.Title>
        {!isLoading && nextUnit && (
          <Card.Link
            to="/learning/$chapterId/$unitId"
            params={{
              chapterId: String(chapterId),
              unitId: String(nextUnit.unitId),
            }}
          >
            전체 학습화면 보기
          </Card.Link>
        )}
      </Card.Header>

      {isLoading ? (
        <UnitListCardBodySkeleton />
      ) : (
        <>
          <div className="w-full px-3 md:px-5">
            <LabeledProgressBar label={chapterTitle} value={chapterProgressRate} />
          </div>
          <UnitListScrollArea units={units} />
          <div className="min-h-[37px] w-full px-3 md:min-h-[56px] md:px-5">
            {nextUnit && (
              <LinkButton
                to="/learning/$chapterId/$unitId"
                display="block"
                params={{
                  chapterId: String(chapterId),
                  unitId: String(nextUnit.unitId),
                }}
              >
                이어서 학습하기
              </LinkButton>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

function UnitListCardBodySkeleton() {
  return (
    <>
      <div className="w-full px-3 md:px-5">
        <div className="flex flex-col gap-1 md:gap-1.5">
          <div className="flex justify-between items-center">
            <Skeleton variant="text" width={120} textSize="heading1" className="h-[1lh]" />
            <Skeleton variant="text" width={36} textSize="body1Normal" className="h-[1lh]" />
          </div>
          <ProgressBar value={0} />
        </div>
      </div>
      <div className="h-[168px] overflow-hidden md:h-[184px]">
        <div className="flex h-fit w-full flex-col gap-2 px-3 pb-3 md:px-5 md:pb-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" className="h-[42px] w-full md:h-14" />
          ))}
        </div>
      </div>
      <div className="min-h-[37px] w-full px-3 md:min-h-[56px] md:px-5">
        <Skeleton
          variant="rectangular"
          className="block h-[37px] w-full rounded-sm md:h-[56px] md:rounded-lg"
        />
      </div>
    </>
  );
}
