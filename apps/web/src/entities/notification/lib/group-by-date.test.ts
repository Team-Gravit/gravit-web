import { describe, expect, it } from 'vitest';

import type { Notification } from '../model/types';
import { groupByDate } from './group-by-date';

function noti(id: number, createdAt: string): Notification {
  return {
    id,
    type: 'NOTICE',
    message: `메시지 ${id}`,
    actionType: 'NONE',
    read: false,
    createdAt,
    timeAgo: '2시간 전',
  };
}

describe('groupByDate', () => {
  it('같은 날짜 2건은 한 그룹에 묶이고 라벨은 "YYYY. MM. DD (요일)" 이다', () => {
    const groups = groupByDate([noti(1, '2026-05-22T10:00:00'), noti(2, '2026-05-22T09:00:00')]);

    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('2026. 05. 22 (금)');
    expect(groups[0].items).toHaveLength(2);
  });

  it('다른 날짜는 2그룹이고 최신 날짜가 먼저 온다', () => {
    const groups = groupByDate([noti(1, '2026-05-21T10:00:00'), noti(2, '2026-05-22T10:00:00')]);

    expect(groups).toHaveLength(2);
    expect(groups[0].label).toBe('2026. 05. 22 (금)');
    expect(groups[1].label).toBe('2026. 05. 21 (목)');
  });

  it('빈 배열이면 빈 배열을 반환한다', () => {
    expect(groupByDate([])).toEqual([]);
  });
});
