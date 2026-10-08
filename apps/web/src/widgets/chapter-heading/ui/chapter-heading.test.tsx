import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { ChapterHeading } from './chapter-heading';

const UNITS_URL = '*/api/v1/units/1';

const UNIT_PAGE = {
  chapterSummaryResponse: { chapterId: 1, title: '자료구조', description: '자료를 다루는 방법' },
  unitDetailResponses: [],
};

describe('ChapterHeading', () => {
  it('withBreadcrumb 이면 「학습」 링크와 현재 위치를 그린다', async () => {
    server.use(http.get(UNITS_URL, () => HttpResponse.json(UNIT_PAGE)));
    await renderWithProviders(() => <ChapterHeading chapterId={1} withBreadcrumb />, {
      extraPaths: ['/learning'],
    });

    expect(await screen.findByRole('link', { name: '학습' })).toHaveAttribute('href', '/learning');
    expect(screen.getByRole('navigation', { name: '현재 위치' })).toHaveTextContent('자료구조');
    expect(screen.getByRole('heading', { name: '자료구조' })).toBeInTheDocument();
  });

  it('withBreadcrumb 이 없으면 경로를 그리지 않는다', async () => {
    server.use(http.get(UNITS_URL, () => HttpResponse.json(UNIT_PAGE)));
    await renderWithProviders(() => <ChapterHeading chapterId={1} />);

    expect(await screen.findByRole('heading', { name: '자료구조' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('headingLevel 이 2 면 제목을 h2 로 그린다', async () => {
    server.use(http.get(UNITS_URL, () => HttpResponse.json(UNIT_PAGE)));
    await renderWithProviders(() => <ChapterHeading chapterId={1} headingLevel={2} />);

    expect(await screen.findByRole('heading', { name: '자료구조', level: 2 })).toBeInTheDocument();
  });

  it('조회에 실패하면 아무것도 그리지 않는다', async () => {
    server.use(http.get(UNITS_URL, () => new HttpResponse(null, { status: 500 })));
    const { container } = await renderWithProviders(() => (
      <ChapterHeading chapterId={1} withBreadcrumb />
    ));

    // 요청이 끝난 뒤에도 제목·경로가 없어야 한다.
    await waitFor(() => expect(container.querySelector('[aria-busy="true"]')).toBeNull());
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
