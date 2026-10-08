import { useRef, useState } from 'react';

import { IconButton } from '@/shared/ui/icon-button';
import { ScrollArea } from '@/shared/ui/scroll';
import { NotificationFallback, NotificationItem, useInboxQuery } from '@/entities/notification';
import { ProfileAvatar } from '@/entities/user';

import { usePopoverDismiss } from '../lib/use-popover-dismiss';
import { NotificationAction } from './notification-action';

/**
 * 데스크톱 헤더 벨 아래 앵커되는 알림 팝오버(ADR-1: 직접 구현, 의존성 0).
 * 벨 래퍼에 relative, 팝오버는 absolute 로 벨 아래 붙는다. 외부 클릭·Esc 로 닫는다.
 */
export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: notifications } = useInboxQuery();

  usePopoverDismiss({ isOpen, onDismiss: () => setIsOpen(false), containerRef });

  return (
    <div ref={containerRef} className="relative flex items-center">
      <IconButton
        icon="bell"
        aria-label="알림"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        // 헤더 variant(solid/overlay)의 글자색을 그대로 물려받는다. ghost 기본색(text-text-2)을
        // 두면 solid 에서 묻혀 안 보인다. hover 도 ghost 기본(bg-bg-2 ≈ bg-1)이라 solid 에서
        // 거의 안 보이므로, 상속한 글자색 기반 반투명으로 바꿔 solid·overlay 모두 피드백이 보이게 한다.
        className="text-inherit hover:bg-current/10 active:bg-current/10 rounded-full"
      />

      {/* pr-4: Radix 스크롤바는 Root 우측 끝에 붙으므로, 컨테이너 우측 거터(16px)로 Root 를 좁혀
          스크롤바를 시안 위치(우측 끝에서 16px 안쪽)에 맞춘다. */}
      {isOpen && (
        <div className="h-[595px] max-h-[calc(100vh-10rem)] flex flex-col absolute top-full -right-12 z-50 mt-8 w-[500px] rounded-12 bg-white py-7 pr-4 shadow-elevation-1">
          {notifications && notifications.length > 0 ? (
            <ScrollArea className="min-h-0 flex-1" viewportClassName="pl-8 pr-4">
              <ul className="flex flex-col gap-4">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem
                      layout="popover"
                      leading={
                        notification.actor ? (
                          <ProfileAvatar
                            colorNumber={notification.actor.profileImgNumber}
                            className="size-12"
                          />
                        ) : undefined
                      }
                      headline={notification.message}
                      timeAgo={notification.timeAgo}
                      subText={notification.subText}
                      action={
                        <NotificationAction
                          notification={notification}
                          layout="popover"
                          onNavigate={() => setIsOpen(false)}
                        />
                      }
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="flex flex-1 flex-col pl-8 pr-4">
              <NotificationFallback />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
