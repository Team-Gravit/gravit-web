import type { Notification } from '../model/types';

export interface NotificationDateGroup {
  /** 그룹 헤더 라벨. 예: '2026. 05. 22 (금)' */
  label: string;
  items: Notification[];
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatDateLabel(createdAt: string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day} (${WEEKDAYS[date.getDay()]})`;
}

function dateKey(createdAt: string): string {
  const date = new Date(createdAt);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * 알림을 `createdAt` 날짜별로 묶는다. 그룹은 최신 날짜가 먼저 오고, 그룹 안 순서는 입력 순서를
 * 유지한다(서버가 최신순으로 내려준다).
 */
export function groupByDate(notifications: Notification[]): NotificationDateGroup[] {
  const groups = new Map<string, NotificationDateGroup>();

  for (const notification of notifications) {
    const key = dateKey(notification.createdAt);
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(notification);
    } else {
      groups.set(key, { label: formatDateLabel(notification.createdAt), items: [notification] });
    }
  }

  return [...groups.values()].sort(
    (a, b) => new Date(b.items[0].createdAt).getTime() - new Date(a.items[0].createdAt).getTime(),
  );
}
