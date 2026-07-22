import { Link } from '@tanstack/react-router';

import type { MissionRoutePath } from '@/entities/mission/lib/get-mission-url';
import type { MissionDetail } from '@/entities/mission/model/schema';
import { cn } from '@/shared/lib/cn';
import { LinkButton } from '@/shared/ui/button/link-button';
import Card from '@/shared/ui/card/card';
import LabeledProgressBar from '@/shared/ui/progress-bar/labeled-progress-bar';
import ProgressBar from '@/shared/ui/progress-bar/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

type MissionCardProps = {
  missionDetail?: MissionDetail & { url: MissionRoutePath };
  isLoading?: boolean;
  className?: string;
};

export default function MissionCard({
  missionDetail,
  isLoading = false,
  className,
}: MissionCardProps) {
  return (
    <Card className={cn('relative', className)}>
      {!isLoading && missionDetail && (
        <Link
          to={missionDetail.url}
          aria-label={`${missionDetail.missionDescription} 도전하러 가기`}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-main md:hidden"
        />
      )}
      <Card.Header>
        <Card.Title>오늘의 미션</Card.Title>
      </Card.Header>
      {isLoading || !missionDetail ? (
        <MissionCardBodySkeleton />
      ) : (
        <MissionCardBody missionDetail={missionDetail} />
      )}
    </Card>
  );
}

function MissionCardBody({
  missionDetail,
}: {
  missionDetail: MissionDetail & { url: MissionRoutePath };
}) {
  const { awardXp, progressRate, missionDescription } = missionDetail;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col justify-between md:gap-2">
        <div className="flex min-h-0 flex-col gap-1">
          <h3 className="line-clamp-2 text-text-1 text-headline2 leading-none md:text-title3">
            {missionDescription}
          </h3>
          <span className="text-main text-caption1 md:text-body1-normal">
            완료 시 + {awardXp}XP
          </span>
        </div>
        <LabeledProgressBar
          value={progressRate * 100}
          label="진행률"
          labelClassName="text-gray-500 text-caption1 md:text-body1-normal"
          valueClassName="text-caption1 md:text-body1-normal"
        />
      </div>
      <LinkButton display="block" to={missionDetail.url} className="hidden md:flex">
        도전하러 가기
      </LinkButton>
    </>
  );
}

function MissionCardBodySkeleton() {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col justify-between md:gap-2">
        <div className="flex min-h-0 flex-col gap-1">
          <Skeleton variant="text" className="w-4/5 md:text-title3" textSize="headline2" />
          <Skeleton
            variant="text"
            width={88}
            textSize="caption1"
            className="md:text-body1-normal"
          />
        </div>
        <div className="flex flex-col gap-1 md:gap-1.5">
          <div className="flex justify-between items-center">
            <Skeleton
              variant="text"
              width={40}
              textSize="caption1"
              className="md:text-body1-normal"
            />
            <Skeleton
              variant="text"
              width={28}
              textSize="caption1"
              className="md:text-body1-normal"
            />
          </div>
          <ProgressBar value={0} />
        </div>
      </div>
      <Skeleton variant="rectangular" className="hidden h-[56px] w-full rounded-lg md:block" />
    </>
  );
}
