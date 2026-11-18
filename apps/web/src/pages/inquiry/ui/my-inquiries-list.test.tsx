import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { InquirySummaryResponse } from '@/entities/inquiry';
import { renderWithProviders } from '@/shared/lib/testing';

import { MyInquiriesList } from './my-inquiries-list';

const inquiry: InquirySummaryResponse = {
  id: 1,
  title: '문의 제목',
  type: 'BUG_REPORT',
  status: 'PENDING',
  createdAt: '2026-06-21T00:00:00Z',
};

const LOADED = { hasLoadError: false, onRetry: () => Promise.resolve() };
const EMPTY_TEXT = /등록된 문의 내역이 없어요\./;

describe('MyInquiriesList', () => {
  it('문의가 있으면 제목·유형·상태를 보여준다', async () => {
    await renderWithProviders(() => (
      <MyInquiriesList inquiries={[inquiry]} isPending={false} {...LOADED} />
    ));

    expect(screen.getByText('문의 제목')).toBeInTheDocument();
    expect(screen.getByText('버그 신고')).toBeInTheDocument();
    expect(screen.getByText('답변 대기')).toBeInTheDocument();
  });

  it('문의가 없으면 안내와 문의하기 버튼을 보여준다', async () => {
    await renderWithProviders(
      () => <MyInquiriesList inquiries={[]} isPending={false} {...LOADED} />,
      {
        extraPaths: ['/settings/inquiry/new'],
      },
    );

    expect(screen.getByText(EMPTY_TEXT)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '문의하기' })).toBeInTheDocument();
  });

  it('항목을 누르면 아코디언이 펼쳐진다', async () => {
    await renderWithProviders(() => (
      <MyInquiriesList inquiries={[inquiry]} isPending={false} {...LOADED} />
    ));

    const trigger = screen.getByRole('button', { expanded: false });
    await userEvent.click(trigger);

    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
  });

  it('로딩 중에는 빈 상태 문구 대신 스켈레톤을 보인다', async () => {
    await renderWithProviders(() => <MyInquiriesList inquiries={[]} isPending {...LOADED} />);

    expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();
    // 레이아웃 시프트 방지용 스켈레톤 행이 렌더된다.
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('조회가 실패하면 빈 문구 대신 재시도를 보이고, 누르면 onRetry 를 부른다', async () => {
    const onRetry = vi.fn(() => Promise.resolve());
    await renderWithProviders(() => (
      <MyInquiriesList inquiries={[]} isPending={false} hasLoadError onRetry={onRetry} />
    ));

    expect(screen.getByRole('alert')).toHaveTextContent('문의 내역을 불러오지 못했어요.');
    expect(screen.queryByText(EMPTY_TEXT)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
