import { cn } from '@/shared/lib/cn';

export interface PageTitleBarProps {
  title: string;
  className?: string;
}

/**
 * 좁은 화면 상단의 화면 제목 바. 넓은 화면은 `widgets/header`가 대신하므로
 * 이 컴포넌트를 언제 그릴지는 페이지가 정한다.
 *
 * 앱 셸의 콘텐츠 영역이 스크롤을 소유하므로 `sticky`로 따라붙는다.
 */
export function PageTitleBar({ title, className }: PageTitleBarProps) {
  return (
    <header
      data-slot="page-title-bar"
      className={cn(
        'sticky top-0 z-50 flex h-12 shrink-0 items-center justify-center border-b border-divider-1 bg-white',
        className,
      )}
    >
      <h1 className="text-label1 text-text-2">{title}</h1>
    </header>
  );
}
