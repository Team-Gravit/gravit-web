import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { GradientCanvas } from '@/shared/ui/gradient-canvas';
import { SPACE_BANNER_ART } from '@/shared/ui/layout';
import { Skeleton } from '@/shared/ui/skeleton';
import { useUserProfile } from '@/entities/user';

import narrowDecorationSrc from './assets/hero-narrow-decoration.png?w=950&format=webp';

// 좁은 화면 시안의 그림 영역은 475×304. 그라데이션은 내부 그림 상자 기준 값이다.
const NARROW_GRADIENT =
  'linear-gradient(303.01deg, var(--color-space-start) 3.59%, var(--color-space-end) 95.08%)';

// 캔버스(상태 표시줄 포함 히어로 전체)를 크기 기준으로 삼아 그림 상자를 계산한다.
const CANVAS_CLASS = 'absolute inset-0 [container-type:size]';

/*
  좁은 화면: 그림 상자(475:304)를 오른쪽에 붙이고, 높이를 「시안 304px · 폭에 맞춘 높이 · 히어로 높이」 중 큰 값으로
  잡아 상태 표시줄까지 늘어난 히어로도 빈틈없이 덮는다.
  세로는 시안이 보여 주는 영역(그림 높이 38 ~ 304px)의 가운데(56.25%)를 히어로 가운데에 맞추되, 위아래가
  비지 않게 0 ~ (히어로 높이 − 그림 높이) 사이로 막는다. 상태 표시줄이 없는 475px 이하에서는 시안처럼 위를 38px 자른다.
  넓은 화면: 오른쪽(지구 쪽)을 기준으로 붙여 1920px보다 좁으면 왼쪽이 잘리고 넓으면 키운다.
*/
const ARTWORK_CLASS = cn(
  '[--hero-art-h:max(64cqw,304px,100cqh)] left-auto h-(--hero-art-h) aspect-475/304',
  'top-[clamp(calc(100cqh-var(--hero-art-h)),calc(50cqh-0.5625*var(--hero-art-h)),0px)] bottom-auto',
  'md:top-1/2 md:h-auto md:aspect-1920/274 md:w-[max(100%,1920px)] md:-translate-y-1/2',
);

/**
 * 당겨서 새로고침할 때 히어로 위로 드러나는 바탕. 좁은 화면 그림 상자(475px 이하) 맨 위쪽 줄 색을 위로 늘인
 * 가로 그라데이션이다. 정지점은 그림 상자 그라데이션(303.01deg)의 38px 줄을 폭 기준으로 옮긴 값이고,
 * 그림 0 ~ 38px 줄과의 차이는 1/255 안이라 히어로 윗변이 어느 줄이어도 이어진다.
 */
export const HERO_TOP_ROW_BACKGROUND =
  'linear-gradient(90deg, var(--color-space-end) 6.97%, var(--color-space-start) 136.5%) right top / max(100%, 475px) 100% no-repeat var(--color-space-end)';

export interface HeroGreetingProps {
  className?: string;
  /** 좁은 화면에서 히어로 상단에 겹쳐 놓을 요소. */
  children?: ReactNode;
}

/** 프로필 조회가 실패해도 별도 오류 UI 대신 기본 인사말을 유지한다. */
export function HeroGreeting({ className, children }: HeroGreetingProps) {
  const { data: profile, isPending } = useUserProfile();

  return (
    <section
      data-slot="hero-greeting"
      // box-content: 히어로 높이는 그대로 두고 그림을 상태 표시줄 뒤까지 늘린다.
      className={cn(
        'relative box-content h-66.5 w-full overflow-hidden pt-(--safe-area-top) md:h-68.5',
        className,
      )}
    >
      <GradientCanvas
        gradient={NARROW_GRADIENT}
        decoration={{ src: narrowDecorationSrc }}
        wide={SPACE_BANNER_ART}
        artworkClassName={ARTWORK_CLASS}
        // 첫 화면 상단의 가장 큰 그림이다.
        decorationPriority="high"
        className={CANVAS_CLASS}
      />
      {/* 좁은 화면에서 히어로 하단을 페이지 배경과 자연스럽게 잇는다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-15.5 bg-gradient-to-b from-transparent to-bg-2 md:hidden"
      />

      {children ? (
        <div className="absolute inset-x-4 top-[calc(var(--safe-area-top)+0.75rem)]">
          {children}
        </div>
      ) : null}

      <div className="absolute bottom-12.5 left-4 flex flex-col gap-1 text-text-1-w md:bottom-14 md:left-19">
        <h1 className="text-title3 [text-shadow:0_2px_4px_rgba(0,0,0,0.2)] md:text-display1 md:[text-shadow:none]">
          어서오세요,{' '}
          {isPending ? (
            <Skeleton
              data-slot="nickname-placeholder"
              aria-busy="true"
              className="w-24 bg-white/20 align-baseline md:w-40"
            />
          ) : (
            profile && <span>{profile.nickname}님!</span>
          )}
        </h1>
        <p className="text-body1-normal md:text-heading2">그래빗과 함께 CS 지식을 마스터해요!</p>
      </div>
    </section>
  );
}
