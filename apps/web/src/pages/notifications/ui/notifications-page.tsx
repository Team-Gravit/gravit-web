import { useRefetchActiveQueries } from '@/shared/api';
import { PullToRefresh } from '@/shared/ui/pull-to-refresh';
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
  const refetchActiveQueries = useRefetchActiveQueries();

  return (
    // 앱 셸 밖 화면이라 목록이 직접 스크롤한다. 당긴 목록이 화면 아래로 넘치지 않게 자른다.
    <div className="flex h-svh flex-col overflow-hidden bg-bg-2">
      <PageTitleBar title="알림" backTo={{ to: '/my' }} className="md:hidden" />

      {/* 제목 막대는 두고 그 아래만 내려간다. 빈 상태에서도 당겨서 다시 불러올 수 있다. */}
      <PullToRefresh onRefresh={refetchActiveQueries} className="min-h-0 flex-1">
        {notifications && notifications.length > 0 ? (
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-y-none px-4 py-5 scrollbar-hide">
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
      </PullToRefresh>
    </div>
  );
}
