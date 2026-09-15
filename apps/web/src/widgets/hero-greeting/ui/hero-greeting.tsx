import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/ui/skeleton';
import { useUserProfile } from '@/entities/user';

import heroNarrow from './assets/hero-narrow.webp';
import heroWide from './assets/hero-wide.webp';

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
      className={cn('relative h-66.5 w-full overflow-hidden md:h-68.5', className)}
    >
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet={heroWide} />
        <img src={heroNarrow} alt="" className="size-full object-cover object-right" />
      </picture>
      {/* 좁은 화면에서 히어로 하단을 페이지 배경과 자연스럽게 잇는다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-15.5 bg-gradient-to-b from-transparent to-bg-2 md:hidden"
      />

      {children ? <div className="absolute inset-x-4 top-3">{children}</div> : null}

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
