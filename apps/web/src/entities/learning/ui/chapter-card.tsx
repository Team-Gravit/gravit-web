import { Link } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';
import { GradientCanvas } from '@/shared/ui/gradient-canvas';
import { InfoTooltip } from '@/shared/ui/info-tooltip';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton';

import { CHAPTER_CARD_BACKGROUND, CHAPTER_CARD_BACKGROUND_FIT_CLASS } from './card-background';
import { getPlanetImage } from './planets';

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
    'relative flex h-full w-full flex-col overflow-hidden',
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
  /** 행성 이미지는 기본적으로 지연 로딩한다. 첫 화면에 보이는 카드에는 `eager`를 지정한다. */
  planetLoading?: 'eager' | 'lazy';
  className?: string;
}

/**
 * 링크를 콘텐츠 위에 겹쳐 카드 전체를 클릭 영역으로 만든다.
 *
 * 링크의 `aria-label`은 자식에서 계산되는 접근 가능한 이름을 대체하므로 챕터 설명은 링크 밖의
 * 정보 아이콘의 말풍선으로 노출한다.
 */
export function ChapterCard({
  chapterId,
  title,
  description,
  progressPercent,
  planetLoading = 'lazy',
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
      <div className={chapterCardVariants({ size: cardSize })}>
        <GradientCanvas
          {...CHAPTER_CARD_BACKGROUND}
          artworkClassName={CHAPTER_CARD_BACKGROUND_FIT_CLASS}
          // 카드가 모두 같은 장식 파일을 써서 요청은 한 번뿐이다. 첫 화면 카드만 우선순위를 올린다.
          decorationPriority={planetLoading === 'eager' ? 'high' : 'auto'}
          className="absolute inset-0"
        />
        {planet ? (
          <img
            src={planet}
            alt=""
            aria-hidden
            loading={planetLoading === 'lazy' ? 'lazy' : undefined}
            decoding="async"
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
              // 제목과 같은 글꼴로 한 줄 높이(1lh) 칸을 만들어 아이콘을 그 줄의 세로 가운데에 둔다.
              <span className={cn('flex h-[1lh] shrink-0 items-center font-mbc', style.title)}>
                <InfoTooltip
                  content={description}
                  label={`${title} 설명 보기`}
                  className="pointer-events-auto size-6 text-text-1-w"
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
