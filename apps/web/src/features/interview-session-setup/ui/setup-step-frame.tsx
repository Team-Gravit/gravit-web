import type { ReactNode } from 'react';

import { IconButton } from '@/shared/ui/icon-button';

import type { SessionSetupProgress } from '../model/session-setup-rules';

interface SetupStepFrameProps {
  title: string;
  progress: SessionSetupProgress | null;
  onExit: () => void;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * 단계 화면 공통 골격
 * - 모바일은 하단 버튼을 화면 바닥에 붙이고, md 이상은 본문 바로 아래 오른쪽에 배치
 */
export function SetupStepFrame({ title, progress, onExit, children, footer }: SetupStepFrameProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-2">
      <header className="flex h-12 shrink-0 items-center border-b border-divider-1 bg-bg-0 md:h-21 md:bg-white/20 px-3 md:px-7">
        <IconButton
          icon="home"
          aria-label="AI면접 홈으로 이동"
          onClick={onExit}
          className="rounded-none text-icon md:size-8"
        />
      </header>

      {/*
        md 이상은 남는 높이를 위아래로 나눠 가운데 정렬하고, 간격은 화면 높이에 따라 32~60px(시안 60px)로 줄인다.
        노트북처럼 낮은 화면에서도 하단 버튼까지 한 화면에 들어오게 하기 위함이다.
      */}
      <main className="flex flex-1 flex-col justify-between md:items-center md:justify-center md:px-8 md:py-10">
        <div className="flex w-full flex-col items-center gap-8 px-4 py-10 md:max-w-300 md:gap-[clamp(--spacing(8),6vh,--spacing(15))] md:p-0">
          {progress && (
            <ol aria-label="진행 단계">
              {progress.labels.map((label, index) => (
                <li key={label} aria-current={index === progress.currentIndex ? 'step' : undefined}>
                  {label}
                </li>
              ))}
            </ol>
          )}
          <h1 className="text-center text-heading2 text-text-1 md:text-display2">{title}</h1>
          <div className="w-full">{children}</div>
        </div>

        <footer className="flex w-full gap-3 px-4 py-5 md:mt-[clamp(--spacing(8),6vh,--spacing(15))] md:max-w-300 md:justify-end md:p-0">
          {footer}
        </footer>
      </main>
    </div>
  );
}
