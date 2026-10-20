import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import bannerNarrow from './assets/banner-narrow.webp';
import bannerWide from './assets/banner-wide.webp';

// 세션 문항 수는 #298에서 확정할 예정이다.
const INTERVIEW_QUESTION_COUNT = 6;

export interface InterviewBannerProps {
  layout: 'wide' | 'narrow';
  className?: string;
}

export function InterviewBanner({ layout, className }: InterviewBannerProps) {
  const isWide = layout === 'wide';

  return (
    <section
      data-section="interview-banner"
      data-layout={layout}
      className={cn(
        'relative isolate flex flex-col justify-center overflow-hidden',
        isWide ? 'h-100.75 gap-8 rounded-12 p-8' : 'h-50.5 gap-4 px-4 py-6',
        className,
      )}
    >
      {/* 캐릭터가 의자에 앉은 장면이라 배경·오버레이·캐릭터를 플랫폼별로 한 장씩 받았다
          (Figma 웹 15510:13057 · 모바일 15512:13118). 폭이 줄면 장면이 있는 오른쪽을 고정하고 왼쪽을 잘라낸다. */}
      <img
        src={isWide ? bannerWide : bannerNarrow}
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover object-right"
      />

      <div className="flex flex-col gap-2 text-text-1-w">
        <h1 className={isWide ? 'text-title1' : 'text-heading2'}>
          AI 면접으로 {isWide ? null : <br />}실전 감각을 키워보세요!
        </h1>
        <p className={cn('text-text-2-w', isWide ? 'text-body1-normal' : 'text-label2')}>
          CS 개념부터 직군 실무까지, {isWide ? null : <br />}
          {INTERVIEW_QUESTION_COUNT}문항으로 점검해요.
        </p>
      </div>

      <Button asChild size={isWide ? 'cta' : 'sm'} className={isWide ? 'w-fit' : 'w-full'}>
        <Link to="/interview/new/$step" params={{ step: 'answer-type' }}>
          새 세션 시작
        </Link>
      </Button>
    </section>
  );
}
