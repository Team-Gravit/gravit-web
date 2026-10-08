import type { ReactNode } from 'react';

import Card from '@/shared/ui/card/card';

type SectionCardProps = {
  /** 헤더 좌측 제목. loading/error/empty/success 어떤 상태에서도 항상 표시되어 헤더 높이를 고정합니다. */
  title: string;
  /** 헤더 우측 액션(예: '자세히 보기' 링크). 상태와 무관하게 헤더를 고정하려면 항상 전달하세요. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * 메인 페이지 섹션들의 공통 카드 셸.
 *
 * loading/error/empty/success 네 상태가 "동일한 Card + 헤더"를 공유하고
 * 본문(children)만 교체되도록 하여 상태 전환 시 레이아웃 시프트(CLS)를 제거합니다.
 * 본문의 높이 예약은 각 본문 컴포넌트(예: SectionStatus)의 min-height로 맞춥니다.
 */
export default function SectionCard({ title, action, className, children }: SectionCardProps) {
  return (
    <Card className={className}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {action}
      </Card.Header>
      {children}
    </Card>
  );
}
