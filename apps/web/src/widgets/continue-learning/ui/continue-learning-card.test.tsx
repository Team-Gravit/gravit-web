import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { ContinueLearningCard } from './continue-learning-card';
import { RecentUnitCard } from './recent-unit-card';

const LEARNING_URL = '*/api/v1/main-pages/learning';
const LEARNING = {
  recentSolvedChapterId: 7,
  recentSolvedChapterTitle: '자료구조',
  recentSolvedChapterProgressRate: 10,
  units: [
    { unitId: 11, title: '배열', status: 'COMPLETED' },
    { unitId: 12, title: '스택', status: 'IN_PROGRESS' },
    { unitId: 13, title: '큐', status: 'NOT_STARTED' },
  ],
};
const EXTRA_PATHS = ['/learning', '/learning/chapters/$chapterId', '/learning/units/$unitId'];

function renderCard() {
  const Target = () => <ContinueLearningCard />;
  return renderWithProviders(Target, { extraPaths: EXTRA_PATHS });
}

describe('ContinueLearningCard', () => {
  it('챕터 제목 · 진행률 · 행 3개(순번 + 칩 3종) · 「2강 이어서 학습하기」→/learning/units/12 (AC-12)', async () => {
    server.use(http.get(LEARNING_URL, () => HttpResponse.json(LEARNING)));
    await renderCard();

    expect(await screen.findByText('자료구조')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: '자료구조' })).toHaveAttribute(
      'aria-valuenow',
      '10',
    );

    const rows = screen.getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual([
      'Unit 01배열학습 완료',
      'Unit 02스택학습 중',
      'Unit 03큐잠김',
    ]);
    expect(rows.map((row) => row.getAttribute('data-status'))).toEqual([
      'completed',
      'inProgress',
      'locked',
    ]);

    expect(screen.getByRole('link', { name: '2강 이어서 학습하기' })).toHaveAttribute(
      'href',
      '/learning/units/12',
    );
  });

  it('전부 완료면 CTA는 없고 챕터 전체 보기 링크는 남는다 (AC-13)', async () => {
    server.use(
      http.get(LEARNING_URL, () =>
        HttpResponse.json({
          ...LEARNING,
          units: LEARNING.units.map((unit) => ({ ...unit, status: 'COMPLETED' })),
        }),
      ),
    );
    await renderCard();

    await screen.findByText('자료구조');
    expect(screen.queryByRole('link', { name: /이어서 학습하기/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '전체 학습화면 보기' })).toHaveAttribute(
      'href',
      '/learning/chapters/7',
    );
  });

  it('헤더의 「전체 학습화면 보기」가 최근 챕터의 유닛 목록으로 간다 (AC-14)', async () => {
    server.use(http.get(LEARNING_URL, () => HttpResponse.json(LEARNING)));
    await renderCard();

    expect(await screen.findByRole('link', { name: '전체 학습화면 보기' })).toHaveAttribute(
      'href',
      '/learning/chapters/7',
    );
  });

  it('404 면 빈 상태, 500 이면 「이어서 학습하기를 불러오지 못했어요.」 + 다시 시도 (AC-15)', async () => {
    server.use(http.get(LEARNING_URL, () => new HttpResponse(null, { status: 404 })));
    const empty = await renderCard();
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('아직 학습 기록이 없어요.');
    expect(within(status).getByRole('link', { name: '학습 시작하기' })).toHaveAttribute(
      'href',
      '/learning',
    );
    empty.unmount();

    server.use(http.get(LEARNING_URL, () => new HttpResponse(null, { status: 500 })));
    await renderCard();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('이어서 학습하기를 불러오지 못했어요.');
    expect(within(alert).getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });

  it('로딩 중에는 제목이 보이고 본문은 aria-busy 다 (AC-24)', async () => {
    server.use(http.get(LEARNING_URL, () => new Promise(() => {})));
    await renderCard();

    expect(screen.getByRole('heading', { name: '이어서 학습하기' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="continue-learning-body"]')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });
});

describe('RecentUnitCard', () => {
  it('최근 챕터의 첫 유닛 카드 한 장, href /learning/units/11 (AC-16)', async () => {
    server.use(http.get(LEARNING_URL, () => HttpResponse.json(LEARNING)));
    await renderWithProviders(RecentUnitCard, { extraPaths: EXTRA_PATHS });

    const card = await screen.findByRole('link', { name: '배열 학습하러 가기' });
    expect(card).toHaveAttribute('href', '/learning/units/11');
    expect(card).toHaveTextContent('Lesson 11');
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('유닛이 없으면 아무것도 그리지 않는다 (기준선 H3)', async () => {
    server.use(http.get(LEARNING_URL, () => HttpResponse.json({ ...LEARNING, units: [] })));
    const { container } = await renderWithProviders(RecentUnitCard, { extraPaths: EXTRA_PATHS });

    // 로딩 중에도 카드가 없으므로 응답 처리가 끝난 뒤 빈 상태인지 확인한다.
    await waitFor(() => expect(container.querySelector('[aria-busy="true"]')).toBeNull());
    expect(container.querySelector('[data-slot="unit-card"]')).toBeNull();
  });
});
