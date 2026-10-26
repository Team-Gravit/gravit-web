import { useState } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import type { InterviewHistorySort } from '@/entities/interview';

import { InterviewHistoryPage } from './interview-history-page';

const HISTORY_URL = '*/api/v1/interview-sessions';

const SESSION = {
  sessionId: 12,
  sequence: 3,
  mode: 'COMMON_CS',
  stack: null,
  topics: [
    { topic: 'DATA_STRUCTURE', displayName: '자료구조' },
    { topic: 'ALGORITHM', displayName: '알고리즘' },
  ],
  startedAt: '2026-07-28T10:00:00',
  score: 68,
  maxScore: 100,
};

// jsdom은 matchMedia를 제공하지 않으므로 넓은 화면 여부를 직접 고정한다.
function stubViewport(isWide: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      media: query,
      matches: isWide,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

// 라우트 대신 페이지와 정렬을 상태로 들고 있는 최소 어댑터.
function HistoryPageHarness() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<InterviewHistorySort>('LATEST');

  return (
    <InterviewHistoryPage
      page={page}
      sort={sort}
      onPageChange={setPage}
      onSortChange={(nextSort) => {
        setSort(nextSort);
        setPage(1);
      }}
    />
  );
}

function renderHistoryPage() {
  return renderWithProviders(HistoryPageHarness, {
    path: '/interview/history',
    extraPaths: ['/interview', '/interview/history/$sessionId'],
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each([
  { layout: 'wide', isWide: true, dateText: '자료구조 · 알고리즘 · 2026년 7월 28일' },
  { layout: 'narrow', isWide: false, dateText: '자료구조 · 알고리즘 · 2026. 07. 28' },
])('InterviewHistoryPage ($layout)', ({ isWide, dateText }) => {
  it('응시 이력을 차수 · 모드 · 주제와 날짜 · 점수로 보여준다', async () => {
    stubViewport(isWide);
    server.use(
      http.get(HISTORY_URL, () =>
        HttpResponse.json({ hasNextPage: false, totalPages: 1, contents: [SESSION] }),
      ),
    );
    await renderHistoryPage();

    const historyItem = (await screen.findByText('CS모드')).closest('li');
    expect(historyItem).not.toBeNull();
    expect(within(historyItem as HTMLElement).getByText('3')).toBeInTheDocument();
    expect(within(historyItem as HTMLElement).getByText(dateText)).toBeInTheDocument();
    expect(within(historyItem as HTMLElement).getByText('68점')).toBeInTheDocument();
    expect(within(historyItem as HTMLElement).getByRole('link')).toHaveAttribute(
      'href',
      '/interview/history/12?tab=summary',
    );
  });

  it('응시 이력이 없으면 빈 상태 문구를 보여준다', async () => {
    stubViewport(isWide);
    server.use(
      http.get(HISTORY_URL, () =>
        HttpResponse.json({ hasNextPage: false, totalPages: 0, contents: [] }),
      ),
    );
    await renderHistoryPage();

    expect(
      await screen.findByText(/아직 응시한 세션이 없어요\.\s*첫 세션을 시작해볼까요\?/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: '페이지 목록' })).not.toBeInTheDocument();
  });

  it('조회에 실패하면 다시 시도를 보여준다', async () => {
    stubViewport(isWide);
    server.use(http.get(HISTORY_URL, () => new HttpResponse(null, { status: 500 })));
    await renderHistoryPage();

    expect(await screen.findByText('응시 이력을 불러오지 못했어요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });
});

describe('InterviewHistoryPage 요청', () => {
  it('정렬과 페이지를 바꾸면 0부터 세는 page 와 sort 로 다시 조회한다', async () => {
    stubViewport(true);
    const requests: string[] = [];
    server.use(
      http.get(HISTORY_URL, ({ request }) => {
        const url = new URL(request.url);
        requests.push(`${url.searchParams.get('page')}:${url.searchParams.get('sort')}`);
        return HttpResponse.json({ hasNextPage: true, totalPages: 3, contents: [SESSION] });
      }),
    );
    const user = userEvent.setup();
    await renderHistoryPage();

    await screen.findByText('CS모드');
    await user.click(screen.getByRole('button', { name: '2 페이지' }));
    await vi.waitFor(() => expect(requests).toContain('1:LATEST'));

    await user.click(screen.getByRole('button', { name: '오래된 순' }));
    await vi.waitFor(() => expect(requests).toContain('0:OLDEST'));

    expect(requests[0]).toBe('0:LATEST');
    expect(screen.getByRole('button', { name: '오래된 순' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
