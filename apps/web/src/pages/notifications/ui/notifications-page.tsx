import {
  groupByDate,
  NotificationFallback,
  NotificationItem,
  useInboxQuery,
} from '@/entities/notification';
import { ProfileAvatar } from '@/entities/user';
import { NotificationAction } from '@/widgets/notification';
import { PageTitleBar } from '@/widgets/page-title-bar';

/**
 * 모바일 알림 페이지. 뒤로가기 + "알림" 타이틀 + 날짜 그룹별 카드 목록.
 * 데스크톱은 헤더 팝오버(widgets/notification)를 쓰므로 PageTitleBar 는 모바일에서만 노출한다.
 * 빈 상태/Fallback UI 는 사용자 소유(Out of Scope)라 여기서 그리지 않는다.
 */
export function NotificationsPage() {
  const { data: notifications } = useInboxQuery();
  const groups = groupByDate(notifications ?? []);

  return (
    <div className="flex h-svh flex-col bg-bg-2">
      <PageTitleBar title="알림" backTo={{ to: '/my' }} className="md:hidden" />

      {notifications && notifications.length > 0 ? (
        <div className="flex flex-col gap-6 px-4 py-5 overflow-scroll">
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-4">
              <p className="text-label2 text-text-4">{group.label}</p>
              <ul className="flex flex-col gap-3">
                {group.items.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem
                      layout="card"
                      leading={
                        notification.actor ? (
                          <ProfileAvatar
                            colorNumber={notification.actor.profileImgNumber}
                            className="size-[38px]"
                          />
                        ) : undefined
                      }
                      // 모바일 FOLLOW 는 닉네임을 헤드라인, 안내 문구를 서브로 분리한다(시안).
                      // message 가 닉네임을 포함하면 중복되므로 백엔드 실데이터로 확인 필요.
                      headline={
                        notification.actor ? notification.actor.nickname : notification.message
                      }
                      timeAgo={notification.timeAgo}
                      subText={notification.actor ? notification.message : notification.subText}
                      action={<NotificationAction notification={notification} layout="card" />}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <NotificationFallback />
      )}
    </div>
  );
}
