import type { MouseEvent, ReactNode } from 'react';

import { Link } from '@tanstack/react-router';

import { useHistoryBackClick } from '@/shared/lib/use-history-back-click';
import { Icon } from '@/shared/ui/icon';

export const QUIZ_EXIT_ROUTE = '/learning/units/$unitId';

export interface QuizTopBarProps {
  title: string;
  unitId: number;
  /** 일반 클릭에서 호출한다. 없으면 이전 기록이나 유닛 상세로 이동한다. */
  onCloseRequest?: () => void;
  /** 상단바 오른쪽에 배치할 조작. */
  trailingAction?: ReactNode;
}

/**
 * `_focus` 레이아웃은 앱 셸을 숨기므로 화면 크기와 관계없이 이 상단바를 사용한다.
 * 이전 기록이 없는 직접 진입에서는 유닛 상세로 현재 기록을 교체한다.
 */
export function QuizTopBar({ title, unitId, onCloseRequest, trailingAction }: QuizTopBarProps) {
  const handleHistoryBackClick = useHistoryBackClick();

  const handleCloseClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // 보조 키나 다른 버튼 클릭은 브라우저의 링크 동작에 맡긴다.
    const shouldUseLinkNavigation =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (onCloseRequest && !shouldUseLinkNavigation) {
      event.preventDefault();
      onCloseRequest();
      return;
    }

    handleHistoryBackClick(event);
  };

  return (
    <header
      data-slot="quiz-top-bar"
      // box-content: 내용 높이는 그대로 두고 상태 표시줄 여백만큼 막대를 위로 늘린다.
      className="sticky top-0 z-50 box-content flex h-12 shrink-0 items-center justify-center border-b border-divider-1 bg-white px-5 pt-(--safe-area-top) md:h-16"
    >
      {/* 좌우 액션 너비와 무관하게 제목을 가운데 두기 위해 액션을 흐름에서 분리한다. */}
      <Link
        to={QUIZ_EXIT_ROUTE}
        params={{ unitId: String(unitId) }}
        replace
        onClick={handleCloseClick}
        aria-label="풀이 닫기"
        className="absolute left-5 inline-flex"
      >
        <Icon name="close-md" className="size-6 text-icon md:size-8" />
      </Link>
      <h1 className="text-label1 text-text-2 md:text-headline2">{title}</h1>
      {trailingAction ? <div className="absolute right-5 inline-flex">{trailingAction}</div> : null}
    </header>
  );
}
