import type { ReactNode } from 'react';

import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { GravitLogo } from '@/shared/ui/logo';

export interface DocumentLayoutProps {
  /** 문서 이름. 본문 머리에 「Gravit {title}」로 표시한다. */
  title: string;
  /** 본문 머리와 맨 아래에 함께 표시하는 시행일 (예: `2026년 11월 13일`). */
  effectiveDate: string;
  /**
   * 화면 폭별 상단 헤더. `shared`가 `widgets`를 import할 수 없어 노드로 받는다.
   * 넓은 화면 헤더는 화면 위에 고정되므로 본문이 그 높이만큼 내려간다.
   */
  wideHeader: ReactNode;
  /** 좁은 화면 헤더는 문서의 `h1`을 가진다고 가정한다. 본문 머리는 그때 `h1`이 아니다. */
  narrowHeader: ReactNode;
  /** 본문 아래에 붙는 영역. **넓은 화면에서만 렌더된다.** */
  footer?: ReactNode;
  children: ReactNode;
}

/** 처리방침·약관처럼 본문이 긴 고지 문서 화면의 껍데기. 본문은 `@/shared/ui/document` 조각으로 채운다. */
export function DocumentLayout({
  title,
  effectiveDate,
  wideHeader,
  narrowHeader,
  footer,
  children,
}: DocumentLayoutProps) {
  const isWide = useIsWideViewport();
  // 좁은 화면은 상단바 제목이 h1 이다. 본문 머리까지 h1 이면 문서 제목이 둘이 된다.
  const TitleTag = isWide ? 'h1' : 'p';

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white md:pt-(--desktop-header-height)">
      {isWide ? wideHeader : narrowHeader}

      <main className="mx-auto flex w-full max-w-[800px] flex-1 flex-col">
        <div className="flex w-full flex-col gap-1 border-b border-bg-2 px-5 pt-6 pb-3 md:px-8">
          <TitleTag className="text-heading1 text-text-1">Gravit {title}</TitleTag>
          <p className="text-label2 text-text-3">시행일 {effectiveDate}</p>
        </div>

        <div className="flex w-full flex-col gap-7 px-5 pt-3 pb-6 md:px-8 md:pb-12">{children}</div>
      </main>

      {/* 좁은 화면에서는 아예 마운트하지 않는다. 숨기기만 하면 이미지까지 내려받는다. */}
      {isWide ? (
        footer
      ) : (
        <div className="flex w-full flex-col gap-3 bg-bg-1 px-5 pt-6 pb-safe-6">
          <GravitLogo className="h-5 w-auto" />
          <div className="flex flex-col gap-0.5 text-caption1 text-text-4">
            <p>Gravit</p>
            <p>시행일: {effectiveDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}
