import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

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

describe('NoticeList', () => {
  it('공지가 있으면 제목·포맷된 날짜를 보이고, 핀 공지만 고정 아이콘이 붙는다 (AC-1)', () => {
    render(<NoticeList notices={[PINNED, NORMAL]} isPending={false} showSkeleton={false} />);

    expect(screen.getByText('점검 안내')).toBeInTheDocument();
    expect(screen.getByText('업데이트')).toBeInTheDocument();
    expect(screen.getByText('2026.01.02')).toBeInTheDocument();
    expect(screen.getByText('2026.01.01')).toBeInTheDocument();

    // 핀 공지는 1건뿐이므로 고정 아이콘도 1개다.
    expect(screen.getAllByLabelText('고정 공지')).toHaveLength(1);
  });

  it('공지가 0건이면 빈 안내 문구를 보인다 (AC-5)', () => {
    render(<NoticeList notices={[]} isPending={false} showSkeleton={false} />);

    expect(screen.getByText('등록된 공지사항이 없어요')).toBeInTheDocument();
  });

  it('지연 로딩(showSkeleton)이면 스켈레톤 행을 보이고 빈 문구는 없다 (AC-3)', () => {
    const { container } = render(<NoticeList notices={[]} isPending showSkeleton />);

    expect(screen.queryByText('등록된 공지사항이 없어요')).not.toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(8);
  });

  it('지연 전 로딩 구간(isPending, !showSkeleton)에는 빈 문구를 띄우지 않는다', () => {
    const { container } = render(<NoticeList notices={[]} isPending showSkeleton={false} />);

    expect(screen.queryByText('등록된 공지사항이 없어요')).not.toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });
});
