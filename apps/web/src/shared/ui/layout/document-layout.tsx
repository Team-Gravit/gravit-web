import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { IconButton } from '@/shared/ui/icon-button';
import { GravitLogo } from '@/shared/ui/logo';

import { PageHeader } from './page-header';

export interface DocumentLayoutProps {
  /** 문서 제목. 화면 폭에 따라 상단바 또는 본문 머리글로 렌더된다. */
  title: string;
  /** 좁은 화면 상단바의 뒤로 가기. 목적지는 화면이 정한다. */
  onBack: () => void;
  /**
   * 본문 아래에 붙는 영역. **넓은 화면에서만 렌더된다.**
   *
   * `shared`가 `widgets`를 import할 수 없어 노드로 받는다. 화면이 무엇을 넣을지 정한다.
   */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 본문이 긴 고지 문서 화면의 껍데기.
 *
 * 제목은 **이 컴포넌트가 렌더한다.** 좁은 화면에서는 상단바가, 넓은 화면에서는 본문 머리글이
 * 문서의 `h1`이 되므로 `children`에 `h1`을 넣지 않는다. 넣으면 `h1`이 둘이 된다.
 *
 * 본문 타이포는 컨테이너에서 상속시킨다. `p`·`li`에 클래스를 붙이지 않아도 되고,
 * 강조 문단처럼 예외가 필요한 곳은 직접 클래스를 줘서 상속을 덮으면 된다.
 * (`[&_p]:` 같은 하위 선택자로 지정하면 자식에 붙인 클래스보다 우선순위가 높아 덮이지 않는다.)
 */
export function DocumentLayout({
  title,
  onBack,
  footer,
  children,
  className,
}: DocumentLayoutProps) {
  const isWide = useIsWideViewport();

  return (
    <>
      {isWide ? (
        <header className="flex h-[var(--header-height)] w-full items-center bg-white px-8 py-4">
          <Link to="/">
            <GravitLogo className="h-6" />
          </Link>
        </header>
      ) : (
        <PageHeader
          title={title}
          leftSlot={
            <IconButton icon="chevron-left" iconSize={24} aria-label="뒤로 가기" onClick={onBack} />
          }
        />
      )}

      <main
        className={cn(
          // 본문 폭과 여백. 좁은 화면 기준값을 두고 md 에서 넓힌다.
          'mx-auto w-full max-w-[800px] px-4 py-5 md:px-8 md:py-12',

          // 본문 타이포는 상속시킨다. 자식에 클래스를 주면 그쪽이 이긴다.
          'text-body2-reading text-text-2 md:text-body1-reading',

          // 제목은 preflight 가 크기·굵기를 지워 상속으로는 살아나지 않으므로 직접 지정한다.
          '[&_h1]:text-title3 [&_h1]:text-text-1 md:[&_h1]:text-title1',
          '[&_h2]:text-heading2 [&_h2]:text-text-1 md:[&_h2]:text-heading1',
          '[&_h3]:text-headline2 [&_h3]:text-text-1 md:[&_h3]:text-headline1',
          '[&_h4]:text-headline2 [&_h4]:text-text-1 md:[&_h4]:text-headline1',

          '[&_a]:text-main [&_a:hover]:underline',

          className,
        )}
      >
        {isWide ? <h1 className="mb-6">{title}</h1> : null}
        {children}
      </main>

      {/* 좁은 화면에서는 아예 마운트하지 않는다. 숨기기만 하면 이미지까지 내려받는다. */}
      {isWide ? footer : null}
    </>
  );
}
