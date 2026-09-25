import { Link } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton';

import { getPlanetImage } from './planets';
import cardBackground from './assets/unit-card-background.webp';

const SIZE_STYLE = {
  lg: {
    radius: 'rounded-12',
    title: 'text-[32px]',
    header: 'items-start',
    gauge: 'h-4',
    percent: 'text-heading2',
  },
  sm: {
    radius: 'rounded-8',
    title: 'text-[20px]',
    header: 'items-end',
    gauge: 'h-2',
    percent: 'text-label1',
  },
} as const;

const chapterCardVariants = cva(
  [
    'relative flex h-full w-full flex-col overflow-hidden bg-cover bg-center',
    // 대응하는 그림자 토큰이 없어 Figma 값을 직접 쓴다. 토큰이 확정되면 교체한다.
    'shadow-[-4px_4px_4px_0_rgba(0,0,0,0.1)]',
  ],
  {
    variants: {
      size: {
        lg: `${SIZE_STYLE.lg.radius} p-8`,
        sm: `${SIZE_STYLE.sm.radius} px-4 py-3`,
      },
    },
    defaultVariants: { size: 'sm' },
  },
);

export interface ChapterCardProps extends VariantProps<typeof chapterCardVariants> {
  chapterId: number;
  title: string;
  description?: string;
  /** 호출부에서 0~100 범위로 보정해 전달한다. */
  progressPercent: number;
  className?: string;
}

/**
 * 링크를 콘텐츠 위에 겹쳐 카드 전체를 클릭 영역으로 만든다.
 *
 * 링크의 `aria-label`은 자식에서 계산되는 접근 가능한 이름을 대체하므로 챕터 설명은 링크 밖의
 * 정보 아이콘으로 노출한다. 정식 툴팁 시안이 없어 설명 표시는 네이티브 `title`을 사용한다.
 */
export function ChapterCard({
  chapterId,
  title,
  description,
  progressPercent,
  size = 'sm',
  className,
}: ChapterCardProps) {
  const cardSize = size ?? 'sm';
  const style = SIZE_STYLE[cardSize];
  const planet = getPlanetImage(chapterId);

  return (
    <article
      data-slot="chapter-card"
      data-size={cardSize}
      className={cn('group relative aspect-square min-w-0', className)}
    >
      <div
        className={chapterCardVariants({ size: cardSize })}
        style={{ backgroundImage: `url(${cardBackground})` }}
      >
        {planet ? (
          <img
            src={planet}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 z-0 w-[70%] translate-x-[15%] translate-y-[15%] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
          />
        ) : null}

        {/* 행성 이미지가 달라도 텍스트 대비를 일정하게 유지한다. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-5 bg-black/20" />

        {/* 카드 클릭은 뒤의 링크로 통과시키고 설명 아이콘만 포인터 입력을 받는다. */}
        <div className="pointer-events-none relative z-30 flex flex-col gap-3">
          <div className={cn('flex justify-between gap-2', style.header)}>
            <span
              className={cn(
                'pointer-events-none line-clamp-2 break-keep font-mbc text-text-1-w',
                style.title,
              )}
            >
              {title}
            </span>
            {description ? (
              <span title={description} className="pointer-events-auto shrink-0 cursor-help">
                <Icon
                  name="info"
                  aria-label={`${title} 설명: ${description}`}
                  className="size-6 text-text-1-w"
                />
              </span>
            ) : null}
          </div>

          <div className="pointer-events-none flex flex-col gap-1">
            <ProgressBar
              value={progressPercent}
              fill={cardSize === 'lg' ? 'solid' : 'gradient'}
              aria-label={`${title} 진행률`}
              className={style.gauge}
            />
            <span className={cn('text-text-1-w', style.percent)}>{progressPercent}%</span>
          </div>
        </div>
      </div>

      <Link
        to="/learning/chapters/$chapterId"
        params={{ chapterId: String(chapterId) }}
        aria-label={`${title} 학습하기`}
        className={cn(
          'absolute inset-0 z-20 outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
          style.radius,
        )}
      />
    </article>
  );
}

export function ChapterCardSkeleton({
  size = 'sm',
  className,
}: Pick<ChapterCardProps, 'size' | 'className'>) {
  const cardSize = size ?? 'sm';
  const style = SIZE_STYLE[cardSize];

  return (
    <div
      data-slot="chapter-card"
      data-size={cardSize}
      aria-busy="true"
      className={cn('aspect-square min-w-0', className)}
    >
      <div className={cn(chapterCardVariants({ size: cardSize }), 'gap-3 bg-bg-3')}>
        <Skeleton className={cn('w-3/4', style.title)} />
        <div className="flex flex-col gap-1">
          <Skeleton variant="block" className={cn('w-full rounded-full', style.gauge)} />
          <Skeleton className={cn('w-10', style.percent)} />
        </div>
      </div>
    </div>
  );
}
