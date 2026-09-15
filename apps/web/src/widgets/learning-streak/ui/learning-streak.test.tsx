import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { LearningStreak } from './learning-streak';

const WEEKLY_RECORD_URL = '*/api/v1/main-pages/weekly-record';
const LEARNING_URL = '*/api/v1/main-pages/learning';
const RECORD = {
  consecutiveSolvedDays: 5,
  MONDAY: true,
  TUESDAY: true,
  WEDNESDAY: true,
  THURSDAY: false,
  FRIDAY: false,
  SATURDAY: false,
  SUNDAY: false,
};

function renderStreak() {
  return renderWithProviders(LearningStreak, { extraPaths: ['/league', '/learning'] });
}

beforeEach(() => {
  // 실행 환경에 따라 요일 상태가 달라지지 않도록 로컬 시간을 수요일로 고정한다.
  vi.useFakeTimers({ toFake: ['Date'], now: new Date(2026, 8, 9, 12) });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('LearningStreak', () => {
  it('연속 일수 · 뱃지 7개 · 「자세히 보기」→/league 를 그리고 learning 은 부르지 않는다 (AC-19)', async () => {
    let learningRequests = 0;
    server.use(
      http.get(WEEKLY_RECORD_URL, () => HttpResponse.json(RECORD)),
      http.get(LEARNING_URL, () => {
        learningRequests += 1;
        return HttpResponse.json({});
      }),
    );
    await renderStreak();

    expect(await screen.findByText('5')).toBeInTheDocument();
    expect(screen.getByText(/일 연속/)).toBeInTheDocument();

    const badges = screen.getAllByText(/^[월화수목금토일]$/);
    expect(badges).toHaveLength(7);
    expect(badges.map((badge) => badge.getAttribute('data-status'))).toEqual([
      'completed',
      'completed',
      'today',
      'upcoming',
      'upcoming',
      'upcoming',
      'upcoming',
    ]);

    expect(screen.getByRole('link', { name: '자세히 보기' })).toHaveAttribute('href', '/league');
    expect(learningRequests).toBe(0);
  });

  it('로딩 중에도 제목과 「자세히 보기」는 보이고 본문은 aria-busy 다 (AC-24)', async () => {
    server.use(http.get(WEEKLY_RECORD_URL, () => new Promise(() => {})));
    await renderStreak();

    expect(screen.getByRole('heading', { name: '연속 학습일' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '자세히 보기' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="learning-streak-body"]')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('404 면 「아직 학습 기록이 없어요.」 + 「학습 시작하기」→/learning 이고 재시도는 없다 (AC-15)', async () => {
    server.use(http.get(WEEKLY_RECORD_URL, () => new HttpResponse(null, { status: 404 })));
    await renderStreak();

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('아직 학습 기록이 없어요.');
    expect(within(status).getByRole('link', { name: '학습 시작하기' })).toHaveAttribute(
      'href',
      '/learning',
    );
    expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument();
  });

  it('500 이면 「학습 기록을 불러오지 못했어요.」 + 「다시 시도」로 1회 재요청한다 (AC-15 · C3)', async () => {
    let requests = 0;
    server.use(
      http.get(WEEKLY_RECORD_URL, () => {
        requests += 1;
        return requests === 1 ? new HttpResponse(null, { status: 500 }) : HttpResponse.json(RECORD);
      }),
    );
    await renderStreak();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('학습 기록을 불러오지 못했어요.');
    expect(screen.getByRole('heading', { name: '연속 학습일' })).toBeInTheDocument();

    await userEvent.click(within(alert).getByRole('button', { name: '다시 시도' }));

    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
    expect(requests).toBe(2);
  });
});
