import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import type { LessonResultResponse } from '@/entities/learning';

import { LessonResultPage } from './lesson-result-page';

const LESSON_RESULT_URL = '*/api/v1/lessons/results/:lessonSubmissionId';
const LESSON_RESULT_LINK_PATHS = ['/main', '/learning/units/$unitId'];

const LESSON_RESULT_FIXTURE: LessonResultResponse = {
  leagueName: '브론즈',
  userLevelResponse: { currentLevel: 13, nextLevel: 14, xp: 789, minXp: 700, maxXp: 900 },
  unitSummaryResponse: {
    unitId: 3,
    displayOrder: 1,
    title: '연결리스트',
    description: '연결리스트를 학습합니다.',
  },
  accuracy: 15,
  learningTime: 196,
  chapterId: 3,
};

async function renderLessonResult(lessonSubmissionId = 345) {
  const LessonResultTestPage = () => <LessonResultPage lessonSubmissionId={lessonSubmissionId} />;

  return renderWithProviders(LessonResultTestPage, { extraPaths: LESSON_RESULT_LINK_PATHS });
}

describe('LessonResultPage', () => {
  it('결과를 기다리는 동안 화면 구조를 스켈레톤으로 보여준다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => new Promise(() => {})));
    const { container } = await renderLessonResult();

    expect(screen.getByRole('status', { name: '결과를 불러오는 중' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(container.querySelectorAll('[data-slot="skeleton"]')).not.toHaveLength(0);
    expect(container.querySelector('[data-slot="spinner"]')).not.toBeInTheDocument();
  });

  it('정답률과 풀이 시간을 보여준다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => HttpResponse.json(LESSON_RESULT_FIXTURE)));
    await renderLessonResult();

    expect(await screen.findByText('15%')).toBeInTheDocument();
    expect(screen.getByText('03:16')).toBeInTheDocument();
    expect(screen.getByText('정답률')).toBeInTheDocument();
    expect(screen.getByText('풀이시간')).toBeInTheDocument();
  });

  it('행성 문구와 유닛 학습 완료 문구를 보여준다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => HttpResponse.json(LESSON_RESULT_FIXTURE)));
    await renderLessonResult();

    expect(
      await screen.findByRole('heading', { name: '지구 정복에 더 가까워졌어요!' }),
    ).toBeInTheDocument();
    expect(screen.getByText('연결리스트 학습 완료')).toBeInTheDocument();
  });

  it('챕터에 맞는 행성 이름으로 문구를 세운다', async () => {
    server.use(
      http.get(LESSON_RESULT_URL, () =>
        HttpResponse.json({ ...LESSON_RESULT_FIXTURE, chapterId: 6 }),
      ),
    );
    await renderLessonResult();

    expect(
      await screen.findByRole('heading', { name: '토성 정복에 더 가까워졌어요!' }),
    ).toBeInTheDocument();
  });

  it('행성 표에 없는 챕터는 유닛 이름으로 문구를 세운다', async () => {
    server.use(
      http.get(LESSON_RESULT_URL, () =>
        HttpResponse.json({ ...LESSON_RESULT_FIXTURE, chapterId: 999 }),
      ),
    );
    await renderLessonResult();

    expect(
      await screen.findByRole('heading', { name: '연결리스트 정복에 더 가까워졌어요!' }),
    ).toBeInTheDocument();
  });

  it('서버의 minXp·maxXp 로 XP 막대를 그린다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => HttpResponse.json(LESSON_RESULT_FIXTURE)));
    await renderLessonResult();

    expect(await screen.findByText('789XP')).toBeInTheDocument();
    expect(screen.getByText('LV14까지')).toBeInTheDocument();
    // (789-700)/(900-700) = 44.5 → 45
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
  });

  it('다음 행동 두 가지를 각각의 목적지로 연결한다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => HttpResponse.json(LESSON_RESULT_FIXTURE)));
    await renderLessonResult();

    expect(await screen.findByRole('link', { name: '홈으로' })).toHaveAttribute('href', '/main');
    expect(screen.getByRole('link', { name: '이어서 학습하기' })).toHaveAttribute(
      'href',
      '/learning/units/3',
    );
  });

  it('없거나 내 것이 아닌 결과는 재시도 대신 빠져나갈 곳을 준다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => new HttpResponse(null, { status: 404 })));
    await renderLessonResult(999);

    expect(await screen.findByText('결과를 찾을 수 없어요.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈으로' })).toHaveAttribute('href', '/main');
  });

  it('서버 오류는 다시 시도할 수 있다', async () => {
    server.use(http.get(LESSON_RESULT_URL, () => new HttpResponse(null, { status: 500 })));
    await renderLessonResult();

    expect(await screen.findByText('결과를 불러오지 못했어요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });
});
