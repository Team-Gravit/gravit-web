import { describe, expect, it, vi } from 'vitest';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { UnitDetailPage } from './unit-detail-page';

const LESSONS_URL = '*/api/v1/lessons/:unitId';

const UNIT_LESSONS = {
  chapterSummary: { chapterId: 7, title: '자료구조' },
  unitSummaryResponse: {
    unitId: 21,
    displayOrder: 1,
    title: '리스트',
    description: '리스트를 학습합니다.',
  },
  bookmarkAccessible: true,
  wrongAnsweredNoteAccessible: true,
  unitId: 21,
  lessonSummaries: [
    { lessonId: 31, title: 'Lesson01', totalProblem: 10, isSolved: false },
    { lessonId: 32, title: 'Lesson02', totalProblem: 5, isSolved: true },
  ],
};

const EXTRA_PATHS = [
  '/learning',
  '/learning/chapters/$chapterId',
  '/learning/lessons/$lessonId',
  '/learning/units/$unitId/concept-note',
  '/learning/units/$unitId/bookmarked-problems',
  '/learning/units/$unitId/incorrect-problems',
];

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

async function renderUnitDetail({ isWide = true } = {}) {
  stubViewport(isWide);
  const Target = () => <UnitDetailPage unitId="21" />;

  return renderWithProviders(Target, { extraPaths: EXTRA_PATHS });
}

describe('UnitDetailPage', () => {
  it('레슨 행을 누르면 그 레슨의 풀이 화면으로 간다 (K2)', async () => {
    server.use(http.get(LESSONS_URL, () => HttpResponse.json(UNIT_LESSONS)));
    await renderUnitDetail();

    expect(await screen.findByRole('link', { name: /Lesson01/ })).toHaveAttribute(
      'href',
      '/learning/lessons/31',
    );
    expect(screen.getByRole('link', { name: /Lesson02/ })).toHaveAttribute(
      'href',
      '/learning/lessons/32',
    );
  });

  it('목적지 3종 카드가 이 유닛의 경로를 가리킨다', async () => {
    server.use(http.get(LESSONS_URL, () => HttpResponse.json(UNIT_LESSONS)));
    await renderUnitDetail();

    expect(await screen.findByRole('link', { name: '개념노트' })).toHaveAttribute(
      'href',
      '/learning/units/21/concept-note',
    );
    expect(screen.getByRole('link', { name: /북마크/ })).toHaveAttribute(
      'href',
      '/learning/units/21/bookmarked-problems',
    );
    expect(screen.getByRole('link', { name: /오답노트/ })).toHaveAttribute(
      'href',
      '/learning/units/21/incorrect-problems',
    );
  });

  it('경로 표시의 챕터 항목이 그 챕터의 유닛 목록으로 돌아간다 (K5)', async () => {
    server.use(http.get(LESSONS_URL, () => HttpResponse.json(UNIT_LESSONS)));
    await renderUnitDetail();

    expect(await screen.findByRole('link', { name: '자료구조' })).toHaveAttribute(
      'href',
      '/learning/chapters/7',
    );
  });

  it('isSolved 에 따라 칩 문구가 「학습 완료」와 「학습 전」으로 갈린다 (K4)', async () => {
    server.use(http.get(LESSONS_URL, () => HttpResponse.json(UNIT_LESSONS)));
    await renderUnitDetail();

    expect(await screen.findByText('학습 전')).toBeInTheDocument();
    expect(screen.getByText('학습 완료')).toBeInTheDocument();
  });

  it('레슨이 0건이면 섹션 제목만 남고 목록이 비어 있다', async () => {
    server.use(
      http.get(LESSONS_URL, () => HttpResponse.json({ ...UNIT_LESSONS, lessonSummaries: [] })),
    );
    await renderUnitDetail();

    expect(await screen.findByText('문제 리스트')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('좁은 화면에서는 경로 표시가 없고 상단 바에 챕터명이 보인다', async () => {
    server.use(http.get(LESSONS_URL, () => HttpResponse.json(UNIT_LESSONS)));
    await renderUnitDetail({ isWide: false });

    expect(await screen.findByRole('heading', { level: 2, name: 'Unit01' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('자료구조');
    expect(screen.queryByRole('navigation', { name: '현재 위치' })).not.toBeInTheDocument();
  });

  it('레슨 조회가 500 으로 실패하면 화면에 아무것도 남지 않는다 (B3)', async () => {
    server.use(http.get(LESSONS_URL, () => new HttpResponse(null, { status: 500 })));
    const { container } = await renderUnitDetail();

    await waitForElementToBeRemoved(() =>
      container.querySelector('[data-slot="unit-detail-page"]'),
    );

    expect(screen.queryByText('문제 리스트')).not.toBeInTheDocument();
  });
  it('북마크할 문제가 없으면 이동하지 않고 안내를 띄운다 (FIX-036 AC-1)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    server.use(
      http.get(LESSONS_URL, () =>
        HttpResponse.json({ ...UNIT_LESSONS, bookmarkAccessible: false }),
      ),
    );
    await renderUnitDetail();

    await userEvent.click(await screen.findByRole('button', { name: /북마크/ }));

    expect(alertSpy).toHaveBeenCalledWith('아직 북마크한 문제가 없어요.');
    expect(screen.queryByRole('link', { name: /북마크/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '개념노트' })).toBeInTheDocument();
  });

  it('틀린 문제가 없으면 오답노트로 이동하지 않고 안내를 띄운다 (FIX-036 AC-2)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    server.use(
      http.get(LESSONS_URL, () =>
        HttpResponse.json({ ...UNIT_LESSONS, wrongAnsweredNoteAccessible: false }),
      ),
    );
    await renderUnitDetail();

    await userEvent.click(await screen.findByRole('button', { name: /오답노트/ }));

    expect(alertSpy).toHaveBeenCalledWith('아직 틀린 문제가 없어요.');
    expect(screen.queryByRole('link', { name: /오답노트/ })).not.toBeInTheDocument();
  });
});
