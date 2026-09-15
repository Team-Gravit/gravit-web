import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { RecommendedUnits } from './recommended-units';

const UNITS_URL = '*/api/v1/main-pages/units';
const UNITS = [
  { unitId: 21, unitTitle: '스택', chapterId: 3, chapterTitle: '자료구조' },
  { unitId: 35, unitTitle: '프로세스', chapterId: 5, chapterTitle: '운영체제' },
];

function renderUnits() {
  return renderWithProviders(RecommendedUnits, {
    extraPaths: ['/learning', '/learning/$chapterId/$unitId'],
  });
}

describe('RecommendedUnits', () => {
  it('카드 2장 — 챕터명 · Lesson 21 · href /learning/3/21, 「전체보기」→/learning (AC-17)', async () => {
    server.use(http.get(UNITS_URL, () => HttpResponse.json(UNITS)));
    await renderUnits();

    const first = await screen.findByRole('link', { name: '자료구조 학습하러 가기' });
    expect(first).toHaveAttribute('href', '/learning/3/21');
    expect(first).toHaveTextContent('Lesson 21');
    expect(screen.getByRole('link', { name: '운영체제 학습하러 가기' })).toHaveAttribute(
      'href',
      '/learning/5/35',
    );
    expect(screen.getByRole('link', { name: '전체보기' })).toHaveAttribute('href', '/learning');
  });

  it('실패하면 「추천 유닛을 불러오지 못했어요.」 + 다시 시도로 재요청한다 (C3)', async () => {
    let requests = 0;
    server.use(
      http.get(UNITS_URL, () => {
        requests += 1;
        return requests === 1 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(UNITS);
      }),
    );
    await renderUnits();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('추천 유닛을 불러오지 못했어요.');
    await userEvent.click(within(alert).getByRole('button', { name: '다시 시도' }));

    expect(await screen.findByRole('link', { name: '자료구조 학습하러 가기' })).toBeInTheDocument();
    expect(requests).toBe(2);
  });
});
