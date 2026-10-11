import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/icon-button';

import type { SessionSetupProgress } from '../model/session-setup-rules';
import { SetupProgress } from './setup-progress';

interface SetupStepFrameProps {
  title: string;
  description?: string;
  headingAlign?: 'left' | 'center';
  desktopHeadingAlign?: 'left' | 'center';
  headingClassName?: string;
  progress: SessionSetupProgress | null;
  onExit: () => void;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * 설정 단계의 공통 틀. 제목·본문·하단 버튼을 받아 배치한다.
 * 긴 화면에서도 홈과 이전/다음 버튼을 사용할 수 있도록 상단 바와 하단 버튼을 sticky로 둔다.
 */
export function SetupStepFrame({
  title,
  description,
  headingAlign = 'center',
  desktopHeadingAlign = headingAlign,
  headingClassName,
  progress,
  onExit,
  children,
  footer,
}: SetupStepFrameProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-2">
      {/*
        스크롤한 본문이 헤더 뒤로 비치지 않도록 페이지 배경 위에 시안의 반투명 흰색을 겹친다.
      */}
      <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center border-b border-divider-1 bg-bg-0 px-3 md:h-18 md:bg-bg-2 md:bg-linear-to-r md:from-white/20 md:to-white/20 md:px-7">
        <IconButton
          icon="home"
          aria-label="AI면접 홈으로 이동"
          onClick={onExit}
          className="rounded-none text-icon md:size-8"
        />
      </header>

      {/*
        진행 단계가 있으면 데스크톱에서 위아래로 60px을 띄운다.
        진행 단계가 없으면 본문을 세로 중앙에 두고, 낮은 화면에서는 제목과 본문 간격을 줄인다.
      */}
      <main className="flex flex-1 flex-col md:items-center md:px-8">
        <div
          className={cn(
            'flex w-full flex-1 flex-col items-center gap-8 px-4 py-10 md:max-w-300 md:gap-0 md:p-0',
            // 모바일 진행 단계는 상단 바에서 20px 아래에 둔다(시안).
            progress ? 'pt-5' : 'md:justify-center md:py-10',
          )}
        >
          {progress && <SetupProgress progress={progress} className="md:my-15" />}
          {/* 로딩·오류 표시가 제목 아래 남은 공간의 가운데에 오도록 본문 높이를 늘린다. */}
          <div
            className={cn(
              'flex w-full flex-1 flex-col gap-8',
              !description && 'md:gap-[clamp(--spacing(8),6vh,--spacing(15))]',
              !progress && 'md:flex-none',
            )}
          >
            <div
              className={cn(
                'flex w-full flex-col gap-2 md:gap-4',
                headingAlign === 'left' ? 'text-left' : 'text-center',
                desktopHeadingAlign === 'left' ? 'md:text-left' : 'md:text-center',
                headingClassName,
              )}
            >
              <h1 className="text-heading2 text-text-1 md:text-display2">{title}</h1>
              {description && (
                <p className="text-caption1 text-text-3 md:text-heading1">{description}</p>
              )}
            </div>
            <div className="flex w-full flex-1 flex-col">{children}</div>
          </div>
        </div>

        {/* 짧은 본문에서는 화면 바닥에, 긴 본문에서는 스크롤 중에도 하단에 표시한다. */}
        <footer className="sticky bottom-0 flex w-full gap-3 bg-bg-2 px-4 py-5 md:max-w-300 md:justify-end md:px-0 md:pt-3 md:pb-10">
          {footer}
        </footer>
      </main>
    </div>
  );
}
