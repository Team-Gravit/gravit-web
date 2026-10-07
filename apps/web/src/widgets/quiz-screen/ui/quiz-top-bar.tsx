import { Link } from '@tanstack/react-router';

import { Icon } from '@/shared/ui/icon';

// 풀이를 닫으면 현재 레슨이 속한 유닛 상세로 돌아간다.
const EXIT_ROUTE = '/learning/units/$unitId';

export interface QuizTopBarProps {
  title: string;
  unitId: number;
}

/**
 * `_focus` 레이아웃은 앱 셸을 숨기므로 화면 크기와 관계없이 이 상단바를 사용한다.
 * 닫을 때는 풀이 화면을 방문 기록에 남기지 않는다.
 */
export function QuizTopBar({ title, unitId }: QuizTopBarProps) {
  return (
    <header
      data-slot="quiz-top-bar"
      className="sticky top-0 z-50 flex h-12 shrink-0 items-center justify-center border-b border-divider-1 bg-white px-5 md:h-16"
    >
      {/* 좌우 액션 너비와 무관하게 제목을 가운데 두기 위해 액션을 흐름에서 분리한다. */}
      <Link
        to={EXIT_ROUTE}
        params={{ unitId: String(unitId) }}
        replace
        aria-label="풀이 닫기"
        className="absolute left-5 inline-flex"
      >
        <Icon size={24} name="close-md" className="text-icon" />
      </Link>
      <h1 className="text-label1 text-text-2 md:text-headline2">{title}</h1>
    </header>
  );
}
