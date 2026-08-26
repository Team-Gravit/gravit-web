import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type SectionStatusProps = {
  /** 상태 메시지 (예: '아직 학습 기록이 없어요.', '학습 기록을 불러오지 못했어요.') */
  message: string;
  /** 재시도 버튼, CTA 링크 등 사용자가 다음에 할 행동 */
  action?: ReactNode;
  /**
   * 성공/로딩 본문과 동일한 높이를 점유하도록 min-height를 전달합니다.
   * 이 값이 상태 전환 시 카드 높이를 고정하는 "예약 공간 계약"입니다.
   */
  className?: string;
};

/**
 * 섹션 본문의 빈 상태(empty) / 에러 상태 공통 표현.
 *
 * 성공 본문과 같은 크기의 박스를 점유하도록 min-height(className)를 받아
 * loading → empty/error 전환에서 레이아웃 시프트가 없게 합니다.
 */
export default function SectionStatus({ message, action, className }: SectionStatusProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-3 text-center text-text-2',
        className,
      )}
    >
      <p className="text-body1-normal">{message}</p>
      {action}
    </div>
  );
}
