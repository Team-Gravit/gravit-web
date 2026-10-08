import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { NotificationPopover } from './notification-popover';

const INBOX_URL = '*/api/v1/notifications';

// Radix ScrollArea 가 ResizeObserver 를 쓰는데 jsdom 에는 없다. 테스트 대상이 아니므로 no-op stub.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const inactivityItem = {
  id: 2,
  type: 'INACTIVITY',
  message: '연속학습이 깨져요.',
  subText: '다음날까지 2시간 남았어요.',
  actionType: 'GO_TO_LEARNING',
  read: false,
  createdAt: '2026-05-22T10:00:00',
  timeAgo: '2시간 전',
};

describe('NotificationPopover', () => {
  it('벨 클릭 시 목록과 이동 액션이 열린다 (AC-4)', async () => {
    server.use(http.get(INBOX_URL, () => HttpResponse.json([inactivityItem])));
    await renderWithProviders(NotificationPopover, { extraPaths: ['/learning'] });

    await userEvent.click(screen.getByRole('button', { name: '알림' }));

    expect(await screen.findByText('연속학습이 깨져요.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '학습하러 가기' })).toHaveAttribute(
      'href',
      '/learning',
    );
  });

  it('Esc 를 누르면 팝오버가 닫힌다 (AC-5)', async () => {
    server.use(http.get(INBOX_URL, () => HttpResponse.json([inactivityItem])));
    await renderWithProviders(NotificationPopover, { extraPaths: ['/learning'] });

    await userEvent.click(screen.getByRole('button', { name: '알림' }));
    expect(await screen.findByText('연속학습이 깨져요.')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByText('연속학습이 깨져요.')).not.toBeInTheDocument();
  });

  it('빈 목록이어도 크래시 없이 항목 0개로 연다 (AC-6)', async () => {
    server.use(http.get(INBOX_URL, () => HttpResponse.json([])));
    await renderWithProviders(NotificationPopover, { extraPaths: ['/learning'] });

    await userEvent.click(screen.getByRole('button', { name: '알림' }));

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
