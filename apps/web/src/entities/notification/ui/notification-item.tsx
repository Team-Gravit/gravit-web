import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

interface NotificationItemProps {
  /** 표시 레이아웃. `card`=모바일 페이지, `popover`=데스크톱 팝오버. */
  layout: 'card' | 'popover';
  /** 좌측 시각 요소. FOLLOW는 actor 아바타, 그 외 타입은 없음. 상위가 결정·크기 지정한다. */
  leading?: ReactNode;
  /** 굵은 헤드라인. 구성(FOLLOW=닉네임/그 외=message)은 플랫폼별로 상위가 정한다. */
  headline: string;
  timeAgo: string;
  subText?: string | null;
  /** 액션 슬롯. actionType별 버튼/링크를 상위(위젯·페이지)가 꽂는다. */
  action?: ReactNode;
  /** 표면별 추가 스타일. */
  className?: string;
}

/**
 * 알림 1건의 표시 전용 레이아웃. 데이터·동작을 모르고 받은 텍스트와 슬롯만 그린다.
 * 모바일 카드는 시간이 헤드라인과 한 줄, 데스크톱 팝오버는 헤드라인/서브/시간이 세로로 쌓인다(시안).
 */
export function NotificationItem({
  layout,
  leading,
  headline,
  timeAgo,
  subText,
  action,
  className,
}: NotificationItemProps) {
  if (layout === 'popover') {
    return (
      <div
        className={cn(
          'flex flex-col gap-6 rounded-8 border border-divider-1 bg-white px-6 py-4',
          className,
        )}
      >
        <div className="flex w-full items-start gap-6">
          {leading}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-heading2 text-text-2">{headline}</p>
            {subText ? <p className="truncate text-body1-normal text-text-3">{subText}</p> : null}
            <p className="text-label1 text-text-4">{timeAgo}</p>
          </div>
        </div>
        {action}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-8 border border-divider-1 bg-white p-4',
        className,
      )}
    >
      <div className="flex w-full items-center gap-3">
        {leading}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className=" text-label1 text-text-1">{headline}</p>
            <p className="shrink-0 text-caption1 text-text-4">{timeAgo}</p>
          </div>
          {subText ? <p className="w-full truncate text-label2 text-text-3">{subText}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
