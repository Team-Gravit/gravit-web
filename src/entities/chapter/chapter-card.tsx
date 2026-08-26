import { Link } from '@tanstack/react-router';

import type { Chapter } from '@/entities/learning/model/_types';
import InfoCircle from '@/shared/assets/icons/info-circle.svg?react';
import cardBackground from '@/shared/assets/images/card-bg.webp';
import { cn } from '@/shared/lib/cn';
import { getPlanetImage } from '@/shared/lib/planet/utils';
import BgCard from '@/shared/ui/card/bg-card';
import ProgressBar from '@/shared/ui/progress-bar/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';
import Tooltip from '@/shared/ui/tooltip/Tooltip';

type ChapterCardStatus = 'available' | 'completed' | 'locked';

type ChapterCardProps = {
  chapter?: Chapter;
  status?: ChapterCardStatus;
  isLoading?: boolean;
  className?: string;
};

const stateClass = {
  available: 'bg-black/20 transition-opacity duration-500 group-hover:opacity-0',
  completed: 'bg-black/10',
  locked: 'bg-black/60',
} satisfies Record<ChapterCardStatus, string>;

export default function ChapterCard({
  chapter,
  status = 'available',
  isLoading = false,
  className,
}: ChapterCardProps) {
  const progressRate = Math.min(Math.max(chapter?.progressRate ?? 0, 0), 100);
  const isInteractive = !isLoading && status !== 'locked' && chapter !== undefined;

  return (
    <article
      aria-busy={isLoading || undefined}
      aria-disabled={status === 'locked' || undefined}
      className={cn('group relative aspect-[1/1.05] min-w-0 md:aspect-square', className)}
    >
      <BgCard
        backgroundImage={cardBackground}
        className="relative h-full overflow-hidden gap-3 shadow-[4px_4px_4px_0_rgba(0,0,0,0.1)] px-4 py-3 rounded-lg"
      >
        <BgCard.Header className="flex items-center justify-between pointer-events-none relative z-30 w-full gap-2">
          {isLoading ? (
            <Skeleton textSize="headline1" className="h-[1lh] w-3/4 bg-white/30 md:text-heading1" />
          ) : (
            <BgCard.Title
              className={cn(
                'line-clamp-2 break-keep text-xl font-normal text-white md:text-heading1 font-mbc',
                status === 'locked' && 'opacity-60',
              )}
            >
              {chapter?.title}
            </BgCard.Title>
          )}

          {!isLoading && status !== 'locked' && chapter?.description && (
            <div className="pointer-events-auto shrink-0">
              <Tooltip
                positionX="RIGHT"
                button={<InfoCircle className="size-6 text-white md:size-7" />}
              >
                <div className="flex w-[280px] items-start gap-2.5">
                  <InfoCircle className="size-5 shrink-0 text-white" />
                  <p className="break-keep text-body2-normal text-white">{chapter.description}</p>
                </div>
              </Tooltip>
            </div>
          )}
        </BgCard.Header>

        {isLoading ? (
          <div className="relative z-10 mt-auto flex flex-col gap-1">
            <div className="flex justify-between">
              <Skeleton width={36} textSize="caption1" className="h-[1lh] bg-white/30" />
              <Skeleton width={28} textSize="caption1" className="h-[1lh] bg-white/30" />
            </div>
            <Skeleton variant="block" height={8} className="w-full rounded-full bg-white/30" />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <ProgressBar value={progressRate} className="z-10 h-4" />
            <span className="text-heading2 text-text-1-w">{progressRate}%</span>
          </div>
        )}

        {!isLoading && chapter && (
          <img
            src={getPlanetImage(chapter.chapterId)}
            alt=""
            aria-hidden
            className={cn(
              'pointer-events-none absolute bottom-0 right-0 z-0 aspect-square w-[70%] translate-x-[15%] translate-y-[15%] object-contain transition-transform duration-500',
              isInteractive && 'group-hover:-rotate-12 group-hover:scale-110',
            )}
          />
        )}

        {!isLoading && (
          <div className={cn('pointer-events-none absolute inset-0 z-5', stateClass[status])} />
        )}
      </BgCard>

      {isInteractive && (
        <Link
          to="/learning/$chapterId"
          params={{ chapterId: String(chapter.chapterId) }}
          aria-label={`${chapter.title} 학습하기`}
          className="absolute inset-0 z-20 rounded-lg focus-visible:outline-2 focus-visible:outline-main md:rounded-xl"
        />
      )}
    </article>
  );
}

export type { ChapterCardProps, ChapterCardStatus };
