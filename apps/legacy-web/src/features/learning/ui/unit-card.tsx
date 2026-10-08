import { Link } from '@tanstack/react-router';

import cardBg from '@/shared/assets/images/card-bg.webp';
import { PLANET_IMAGES } from '@/shared/assets/images/planets';
import { cn } from '@/shared/lib/cn';
import BgCard from '@/shared/ui/card/bg-card';
import { Skeleton } from '@/shared/ui/skeleton/skeleton';

type UnitCardProps = {
  title?: string;
  unitId?: number;
  /** @deprecated unitId를 사용하세요. */
  lessonNum?: number;
  chapterId?: number;
  isLoading?: boolean;
  className?: string;
};

export default function UnitCard({
  title = '',
  unitId,
  lessonNum,
  chapterId = 0,
  isLoading = false,
  className,
}: UnitCardProps) {
  const resolvedUnitId = unitId ?? lessonNum ?? 0;
  const wrapperClassName = cn('block min-w-0 md:h-[232px]', className);

  const card = (
    <BgCard className="relative h-full justify-between overflow-hidden" backgroundImage={cardBg}>
      <BgCard.Header className="flex-col justify-start w-full items-start gap-1 z-10">
        <span className="text-gray-400 block md:hidden text-label2">새 주제 시작하기</span>
        {isLoading ? (
          <Skeleton
            variant="text"
            className="h-[1lh] w-3/4 bg-white/30 md:text-heading1"
            textSize="headline1"
          />
        ) : (
          <BgCard.Title className="text-headline1 text-white md:text-heading1 break-keep line-clamp-3 md:line-clamp-2">
            {title}
          </BgCard.Title>
        )}
        {isLoading ? (
          <Skeleton
            variant="text"
            width={72}
            textSize="caption1"
            className="h-[1lh] bg-white/30 md:text-body1-normal"
          />
        ) : (
          <span className="text-caption1 md:text-body1-normal text-gray-400">
            Lesson {resolvedUnitId.toString().padStart(2, '0')}
          </span>
        )}
      </BgCard.Header>
      {!isLoading && (
        <img
          src={PLANET_IMAGES[chapterId as keyof typeof PLANET_IMAGES]}
          alt=""
          aria-hidden
          className="pointer-events-none aspect-square object-contain absolute h-[70%] md:h-fit md:w-1/2 right-0 bottom-0 translate-x-1/6 translate-y-1/6 z-0"
        />
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={96}
          textSize="label1"
          className="h-[1lh] bg-white/30 md:text-body1-normal"
        />
      ) : (
        <span className="z-10 mt-auto text-label1 text-[#FBF1FF] underline underline-offset-3 md:text-base md:font-medium">
          학습하러 가기 →
        </span>
      )}
    </BgCard>
  );

  if (isLoading) {
    return (
      <div className={wrapperClassName} aria-busy="true">
        {card}
      </div>
    );
  }

  return (
    <Link
      to="/learning/$chapterId/$unitId"
      params={{ chapterId: String(chapterId), unitId: String(resolvedUnitId) }}
      aria-label={`${title} 학습하러 가기`}
      className={cn(
        'rounded-lg focus-visible:outline-2 focus-visible:outline-main md:rounded-xl',
        wrapperClassName,
      )}
    >
      {card}
    </Link>
  );
}
