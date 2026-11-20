import type { ReactNode } from 'react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { NoticeSummaryResponse } from '@/entities/notice';

import { NoticeList } from './notice-list';

const PINNED: NoticeSummaryResponse = {
  id: 1,
  title: '점검 안내',
  summary: '서버 점검',
  pinned: true,
  publishedAt: '2026-01-02T09:30:00Z',
};
const NORMAL: NoticeSummaryResponse = {
  id: 2,
  title: '업데이트',
  summary: '신규 기능',
  pinned: false,
  publishedAt: '2026-01-01T00:00:00Z',
};

// 목록 아이템이 상세로 가는 <Link>라 라우터 컨텍스트가 필요하다.
async function renderWithRouter(ui: ReactNode) {
  const rootRoute = createRootRoute({ component: () => ui });
  const routes = ['/settings/notice', '/settings/notice/$noticeId'].map((path) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: () => null }),
  );
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/settings/notice'] }),
  });

  await router.load();
  render(<RouterProvider router={router as never} />);
}

const LOADED = { hasLoadError: false, onRetry: () => Promise.resolve() };

describe('NoticeList', () => {
  it('공지가 있으면 제목·포맷된 날짜를 보이고, 핀 공지만 고정 아이콘이 붙는다 (AC-1)', async () => {
    await renderWithRouter(
      <NoticeList notices={[PINNED, NORMAL]} isPending={false} showSkeleton={false} {...LOADED} />,
    );

    expect(screen.getByText('점검 안내')).toBeInTheDocument();
    expect(screen.getByText('업데이트')).toBeInTheDocument();
    expect(screen.getByText('2026.01.02')).toBeInTheDocument();
    expect(screen.getByText('2026.01.01')).toBeInTheDocument();

    // 핀 공지는 1건뿐이므로 고정 아이콘도 1개다.
    expect(screen.getAllByLabelText('고정 공지')).toHaveLength(1);
  });

  it('각 아이템은 해당 공지 상세로 가는 링크다 (목록→상세 연결)', async () => {
    await renderWithRouter(
      <NoticeList notices={[PINNED, NORMAL]} isPending={false} showSkeleton={false} {...LOADED} />,
    );

    expect(screen.getByRole('link', { name: /점검 안내/ })).toHaveAttribute(
      'href',
      '/settings/notice/1',
    );
  });

  it('공지가 0건이면 빈 안내 문구를 보인다 (AC-5)', async () => {
    await renderWithRouter(
      <NoticeList notices={[]} isPending={false} showSkeleton={false} {...LOADED} />,
    );

    expect(screen.getByText('등록된 공지사항이 없어요.')).toBeInTheDocument();
  });

  it('지연 로딩(showSkeleton)이면 스켈레톤 행을 보이고 빈 문구는 없다 (AC-3)', async () => {
    const { container } = render(<NoticeList notices={[]} isPending showSkeleton {...LOADED} />);

    expect(screen.queryByText('등록된 공지사항이 없어요.')).not.toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(8);
  });

  it('지연 전 로딩 구간(isPending, !showSkeleton)에는 빈 문구를 띄우지 않는다', () => {
    const { container } = render(
      <NoticeList notices={[]} isPending showSkeleton={false} {...LOADED} />,
    );

    expect(screen.queryByText('등록된 공지사항이 없어요.')).not.toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('조회가 실패하면 빈 문구 대신 재시도를 보이고, 누르면 onRetry 를 부른다', async () => {
    const onRetry = vi.fn(() => Promise.resolve());
    render(
      <NoticeList
        notices={[]}
        isPending={false}
        showSkeleton={false}
        hasLoadError
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('공지사항을 불러오지 못했어요.');
    expect(screen.queryByText('등록된 공지사항이 없어요.')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
