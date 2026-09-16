import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { ChapterGrid } from './chapter-grid';

const CHAPTERS_URL = '*/api/v1/chapters';

const CHAPTERS = [
  {
    chapterSummaryResponse: { chapterId: 3, title: '자료구조', description: '자료를 다루는 방법' },
    chapterProgressRate: 32,
  },
  {
    chapterSummaryResponse: { chapterId: 5, title: '운영체제', description: '프로세스와 메모리' },
    chapterProgressRate: 0,
  },
];

function renderGrid() {
  return renderWithProviders(ChapterGrid, {
    extraPaths: ['/learning/chapters/$chapterId'],
  });
}

describe('ChapterGrid', () => {
  it('응답 순서대로 카드를 그리고 각 카드가 그 챕터로 이동한다', async () => {
    server.use(http.get(CHAPTERS_URL, () => HttpResponse.json(CHAPTERS)));
    await renderGrid();

    const first = await screen.findByRole('link', { name: '자료구조 학습하기' });
    expect(first).toHaveAttribute('href', '/learning/chapters/3');
    expect(screen.getByRole('link', { name: '운영체제 학습하기' })).toHaveAttribute(
      'href',
      '/learning/chapters/5',
    );

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/learning/chapters/3',
      '/learning/chapters/5',
    ]);
  });

  it('진행률을 게이지와 퍼센트 표기에 같은 값으로 반영한다', async () => {
    server.use(http.get(CHAPTERS_URL, () => HttpResponse.json(CHAPTERS)));
    await renderGrid();

    expect(await screen.findByRole('progressbar', { name: '자료구조 진행률' })).toHaveAttribute(
      'aria-valuenow',
      '32',
    );
    expect(screen.getByText('32%')).toBeInTheDocument();
  });

  it('챕터 설명을 ⓘ 의 접근 가능한 이름으로 노출한다', async () => {
    server.use(http.get(CHAPTERS_URL, () => HttpResponse.json(CHAPTERS)));
    await renderGrid();

    expect(
      await screen.findByRole('img', { name: '자료구조 설명: 자료를 다루는 방법' }),
    ).toBeInTheDocument();
  });

  it('빈 배열이면 「챕터가 없습니다.」를 표시한다', async () => {
    server.use(http.get(CHAPTERS_URL, () => HttpResponse.json([])));
    await renderGrid();

    expect(await screen.findByRole('status')).toHaveTextContent('챕터가 없습니다.');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('실패하면 「챕터 목록을 불러오지 못했어요.」 + 다시 시도로 재요청한다', async () => {
    let requests = 0;
    server.use(
      http.get(CHAPTERS_URL, () => {
        requests += 1;
        return requests === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(CHAPTERS);
      }),
    );
    await renderGrid();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('챕터 목록을 불러오지 못했어요.');
    await userEvent.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('link', { name: '자료구조 학습하기' })).toBeInTheDocument();
    expect(requests).toBe(2);
  });
});
