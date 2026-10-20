import { useState } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';
import type { ReportTab } from '@/entities/interview';

import { InterviewReportPage } from './interview-report-page';

const SUMMARY_URL = '*/api/v1/interview-sessions/:sessionId/summary';
const ANSWERS_URL = '*/api/v1/interview-sessions/:sessionId/answers';

const SUMMARY = {
  sessionId: 7,
  sequence: 7,
  startedAt: '2026-06-21T10:00:00',
  score: 68,
  maxScore: 100,
  accuracyScore: 48,
  accuracyMaxScore: 70,
  deliveryScore: 20,
  deliveryMaxScore: 30,
  averageAccuracyScore: 28,
  averageDeliveryScore: 22,
  recentSessions: [
    { sessionId: 6, sequence: 6, accuracyScore: 30, deliveryScore: 24 },
    { sessionId: 7, sequence: 7, accuracyScore: 48, deliveryScore: 20 },
  ],
  answers: [
    {
      displayOrder: 1,
      topic: { topic: 'ALGORITHM', displayName: '알고리즘' },
      accuracyScore: 12,
      deliveryScore: 5,
    },
    {
      displayOrder: 2,
      topic: { topic: 'NETWORK', displayName: '네트워크' },
      accuracyScore: 1,
      deliveryScore: 2,
    },
  ],
  weakTopics: [{ unitId: 3, topic: { topic: 'NETWORK', displayName: '네트워크' } }],
};

function createAnswer(displayOrder: number, displayName: string, isAnswered: boolean) {
  return {
    displayOrder,
    topic: { topic: 'ALGORITHM', displayName },
    questionContent: `${displayName} 질문입니다.`,
    answerContent: isAnswered ? `${displayName} 답변입니다.` : undefined,
    modelAnswer: `${displayName} 모범답안`,
    concepts: [{ name: `${displayName} 핵심 개념`, type: 'ESSENTIAL' }],
    improvementSuggestion: isAnswered ? `${displayName} 개선 제안` : undefined,
    accuracyScore: 7,
    accuracyMaxScore: 14,
    structureScore: 2,
    structureMaxScore: 3,
    clarityScore: 3,
    clarityMaxScore: 3,
  };
}

const ANSWERS = {
  sessionId: 7,
  startedAt: '2026-06-21T10:00:00',
  answers: [createAnswer(1, '알고리즘', true), createAnswer(2, '네트워크', false)],
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

function stubReportResponses() {
  server.use(
    http.get(SUMMARY_URL, () => HttpResponse.json(SUMMARY)),
    http.get(ANSWERS_URL, () => HttpResponse.json(ANSWERS)),
  );
}

// 라우트 대신 탭과 문항을 상태로 들고 있는 최소 어댑터.
function ReportPageHarness({ initialTab }: { initialTab: ReportTab }) {
  const [tab, setTab] = useState<ReportTab>(initialTab);
  const [question, setQuestion] = useState<number>();

  return (
    <InterviewReportPage
      sessionId={7}
      tab={tab}
      question={question}
      onQuestionSelect={(nextQuestion) => {
        setTab('answers');
        setQuestion(nextQuestion);
      }}
    />
  );
}

function renderReportPage(initialTab: ReportTab) {
  return renderWithProviders(() => <ReportPageHarness initialTab={initialTab} />, {
    path: '/interview/history/7',
    extraPaths: [
      '/interview',
      '/interview/history',
      '/interview/history/$sessionId',
      '/learning/units/$unitId',
    ],
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each([
  { layout: 'wide', isWide: true },
  { layout: 'narrow', isWide: false },
])('InterviewReportPage 세션 종합 ($layout)', ({ isWide }) => {
  it('총점 · 평균 대비 · 약점 분야 학습 링크를 보여준다', async () => {
    stubViewport(isWide);
    stubReportResponses();
    await renderReportPage('summary');

    expect(await screen.findByText('평균보다 20점 높아요')).toBeInTheDocument();
    expect(screen.getByText('평균보다 2점 낮아요')).toBeInTheDocument();
    expect(screen.getByText('총점')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '학습 콘텐츠 바로가기' })).toHaveAttribute(
      'href',
      '/learning/units/3',
    );
  });

  it('문항별 득점 막대를 누르면 그 문항의 상세로 이동한다', async () => {
    stubViewport(isWide);
    stubReportResponses();
    const user = userEvent.setup();
    await renderReportPage('summary');

    await user.click(await screen.findByRole('button', { name: 'Q2 정확도 1점, 전달력 2점' }));

    expect(await screen.findByText('네트워크 질문입니다.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('답변하지 않은 문항이에요.')).toBeInTheDocument();
  });

  it('조회에 실패하면 다시 시도를 보여준다', async () => {
    stubViewport(isWide);
    server.use(http.get(SUMMARY_URL, () => new HttpResponse(null, { status: 500 })));
    await renderReportPage('summary');

    expect(await screen.findByText('세션 종합을 불러오지 못했어요.')).toBeInTheDocument();
  });
});

describe('InterviewReportPage 문항별 상세', () => {
  it('넓은 화면은 문항 탭을 바꾸면 그 문항을 보여준다', async () => {
    stubViewport(true);
    stubReportResponses();
    const user = userEvent.setup();
    await renderReportPage('answers');

    expect(await screen.findByText('Q. 알고리즘 질문입니다.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '1. 알고리즘' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByRole('tab', { name: '2. 네트워크' }));

    expect(await screen.findByText('Q. 네트워크 질문입니다.')).toBeInTheDocument();
    expect(screen.getByText('답변하지 않아 개선 피드백이 없어요.')).toBeInTheDocument();
  });

  it('좁은 화면은 첫 문항만 펼치고, 누르면 펼치고 접는다', async () => {
    stubViewport(false);
    stubReportResponses();
    const user = userEvent.setup();
    await renderReportPage('answers');

    const firstToggle = await screen.findByRole('button', { name: /1\. 알고리즘/ });
    const secondToggle = screen.getByRole('button', { name: /2\. 네트워크/ });
    expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
    expect(secondToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('알고리즘 핵심 개념')).toBeInTheDocument();

    await user.click(secondToggle);

    expect(secondToggle).toHaveAttribute('aria-expanded', 'true');
    expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    expect(
      within(secondToggle.closest('li') as HTMLElement).getByText('네트워크 핵심 개념'),
    ).toBeInTheDocument();

    await user.click(secondToggle);

    expect(secondToggle).toHaveAttribute('aria-expanded', 'false');
  });
});
