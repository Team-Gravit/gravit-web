import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';

import { formatUnitNumber } from '../model/unit-progress';
import { getPlanetImage } from './planets';
import unitCardBackground from './assets/unit-card-background.webp';

export interface UnitCardProps {
  title: string;
  unitId: number;
  chapterId: number;
  /** 제목 위에 표시하는 선택적 보조 라벨. */
  eyebrow?: string;
  className?: string;
}

const CARD_SHELL_CLASS =
  'relative flex min-w-0 flex-col overflow-hidden rounded-8 bg-cover bg-center p-3 md:h-58 md:p-5';

export function UnitCard({ title, unitId, chapterId, eyebrow, className }: UnitCardProps) {
  const planet = getPlanetImage(chapterId);

  return (
    <Link
      to="/learning/units/$unitId"
      params={{ unitId: String(unitId) }}
      aria-label={`${title} 학습하러 가기`}
      data-slot="unit-card"
      style={{ backgroundImage: `url(${unitCardBackground})` }}
      className={cn(
        CARD_SHELL_CLASS,
        'h-39 text-white outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
        className,
      )}
    >
      <span className="relative z-10 flex flex-col gap-1">
        {eyebrow ? <span className="text-label2 text-bg-4">{eyebrow}</span> : null}
        <span className="line-clamp-3 break-keep text-headline1 md:line-clamp-2 md:text-heading1">
          {title}
        </span>
        <span className="text-caption1 text-bg-4 md:text-body1-normal md:text-white/50">
          Lesson {formatUnitNumber(unitId)}
        </span>
      </span>
      {planet ? (
        <img
          src={planet}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 h-[70%] translate-x-1/6 translate-y-1/6 object-contain md:h-auto md:w-1/2"
        />
      ) : null}
      <span className="relative z-10 mt-auto text-label1 text-purple-50 underline underline-offset-3 md:text-body1-normal">
        학습하러 가기 →
      </span>
    </Link>
  );
}

export function UnitCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="unit-card"
      aria-busy="true"
      className={cn(CARD_SHELL_CLASS, 'h-39 gap-1 bg-bg-3', className)}
    >
      <Skeleton className="w-3/4 text-headline1 md:text-heading1" />
      <Skeleton className="w-18 text-caption1 md:text-body1-normal" />
      <Skeleton className="mt-auto w-24 text-label1 md:text-body1-normal" />
    </div>
  );
}
