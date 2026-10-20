import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { InterviewPage } from './interview-page';

const DASHBOARD_URL = '*/api/v1/interview-sessions/dashboard';
const EMPTY_DASHBOARD = {
  completedSessionCount: 0,
  recentAverageScore: 0,
  weakestTopics: [],
  recentSessions: [],
  scoreTrends: [],
};
const DASHBOARD = {
  completedSessionCount: 12,
  recentAverageScore: 68,
  weakestTopics: [
    { topic: { topic: 'ALGORITHM', displayName: '알고리즘' }, accuracyRate: 30 },
    { topic: { topic: 'NETWORK', displayName: '네트워크' }, accuracyRate: 62.5 },
  ],
  recentSessions: [
    {
      sessionId: 12,
      sequence: 12,
      mode: 'COMMON_CS',
      topics: [
        { topic: 'DATA_STRUCTURE', displayName: '자료구조' },
        { topic: 'ALGORITHM', displayName: '알고리즘' },
      ],
      startedAt: '2026-07-28T10:00:00',
      score: 68,
      maxScore: 100,
    },
  ],
  scoreTrends: [
    { sequence: 11, score: 40 },
    { sequence: 12, score: 68 },
  ],
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

function renderInterviewPage() {
  return renderWithProviders(InterviewPage, {
    path: '/interview',
    extraPaths: ['/interview/new/$step'],
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each([
  { layout: 'wide', isWide: true },
  { layout: 'narrow', isWide: false },
])('InterviewPage ($layout)', ({ isWide }) => {
  it('완료 세션이 없으면 0회 · 평균 점수 자리 표시 · 세 카드의 빈 상태 문구를 보여준다', async () => {
    stubViewport(isWide);
    server.use(http.get(DASHBOARD_URL, () => HttpResponse.json(EMPTY_DASHBOARD)));
    await renderInterviewPage();

    expect(await screen.findByText(/세션이 쌓이면\s*약점 분야를 알려드려요\./)).toBeInTheDocument();
    expect(
      screen.getByText(/아직 응시한 세션이 없어요\.\s*첫 세션을 시작해볼까요\?/),
    ).toBeInTheDocument();
    expect(screen.getByText(/세션이 1개 이상 쌓이면\s*추이를 볼 수 있어요\./)).toBeInTheDocument();

    const summary = document.querySelector('[data-section="interview-summary"]');
    expect(summary).toHaveTextContent(/0\s*회/);
    expect(summary).toHaveTextContent(/-\s*점/);
    expect(screen.queryByText('전체 보기')).not.toBeInTheDocument();
  });

  it('「새 세션 시작」은 세션 설정 첫 단계로 연결된다', async () => {
    stubViewport(isWide);
    server.use(http.get(DASHBOARD_URL, () => HttpResponse.json(EMPTY_DASHBOARD)));
    await renderInterviewPage();

    expect(await screen.findByRole('link', { name: '새 세션 시작' })).toHaveAttribute(
      'href',
      '/interview/new/answer-type',
    );
  });

  it('데이터가 있으면 요약 · 약한 분야 · 응시 이력을 응답대로 보여준다', async () => {
    stubViewport(isWide);
    server.use(http.get(DASHBOARD_URL, () => HttpResponse.json(DASHBOARD)));
    await renderInterviewPage();

    expect(await screen.findByText('알고리즘')).toBeInTheDocument();
    expect(screen.getByText('정확도 30%')).toBeInTheDocument();
    expect(screen.getByText('정확도 62.5%')).toBeInTheDocument();

    expect(screen.getByText('CS모드')).toBeInTheDocument();
    expect(screen.getByText('자료구조 외 1개 · 7월 28일')).toBeInTheDocument();

    const summary = document.querySelector('[data-section="interview-summary"]');
    expect(summary).toHaveTextContent(/12\s*회/);
    expect(summary).toHaveTextContent(/68\s*점/);
  });

  it('점수 추이는 처음에 현재 점수를 보여주고, 다른 점을 누르면 그 점수로 바꾼다', async () => {
    stubViewport(isWide);
    server.use(http.get(DASHBOARD_URL, () => HttpResponse.json(DASHBOARD)));
    const user = userEvent.setup();
    await renderInterviewPage();

    const currentPoint = await screen.findByRole('button', { name: '현재 68점' });
    expect(currentPoint).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('68점');

    await user.click(screen.getByRole('button', { name: '11차 40점' }));

    expect(screen.getByRole('status')).toHaveTextContent('40점');
    expect(currentPoint).toHaveAttribute('aria-pressed', 'false');
  });

  it('조회에 실패하면 카드마다 다시 시도를 보여준다', async () => {
    stubViewport(isWide);
    server.use(http.get(DASHBOARD_URL, () => new HttpResponse(null, { status: 500 })));
    await renderInterviewPage();

    expect(await screen.findByText('면접 기록을 불러오지 못했어요.')).toBeInTheDocument();
    expect(screen.getByText('가장 약한 분야를 불러오지 못했어요.')).toBeInTheDocument();
    expect(screen.getByText('최근 응시 이력을 불러오지 못했어요.')).toBeInTheDocument();
    expect(screen.getByText('점수 추이를 불러오지 못했어요.')).toBeInTheDocument();
  });
});
