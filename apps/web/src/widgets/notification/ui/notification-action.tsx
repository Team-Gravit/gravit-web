import { Link } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { getActionDescriptor, type Notification } from '@/entities/notification';
import { NotificationCongratulateAction } from '@/features/notification-congratulate';
import { NotificationFollowAction } from '@/features/notification-follow';

interface NotificationActionProps {
  notification: Notification;
  /** 버튼 크기·타이포가 표면마다 다르다. `card`=모바일, `popover`=데스크톱. */
  layout: 'card' | 'popover';
  /** 이동형 액션으로 라우트가 바뀔 때 호출(팝오버를 닫는다). 페이지에서는 불필요. */
  onNavigate?: () => void;
}

/**
 * 알림 1건의 actionType 을 보고 액션 노드를 렌더하는 단일 공유 지점.
 * 팝오버(위젯)와 페이지가 함께 쓰며, FOLLOW/CONGRATULATE 케이스는 Phase 3·4에서 feature 버튼으로 확장한다.
 */
export function NotificationAction({ notification, layout, onNavigate }: NotificationActionProps) {
  const descriptor = getActionDescriptor(notification);

  if (descriptor.kind === 'link') {
    const sizeClass =
      layout === 'popover' ? 'h-[37px] px-5 text-body1-normal' : 'h-8 px-4 text-label2';
    return (
      <Button asChild variant="default" size="sm" className={cn('w-full', sizeClass)}>
        <Link to={descriptor.to} onClick={onNavigate}>
          {descriptor.label}
        </Link>
      </Button>
    );
  }

  if (descriptor.kind === 'follow') {
    return (
      <NotificationFollowAction
        userId={descriptor.userId}
        isFollowing={descriptor.initiallyFollowing}
        layout={layout}
      />
    );
  }

  if (descriptor.kind === 'congratulate') {
    return (
      <NotificationCongratulateAction
        feedId={descriptor.feedId}
        congratulated={descriptor.congratulated}
        layout={layout}
      />
    );
  }

  // none 포함 그 외는 버튼이 없다.
  return null;
}
