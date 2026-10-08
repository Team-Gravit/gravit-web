import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { DailyMission } from './daily-mission';

const MISSION_URL = '*/api/v1/main-pages/mission';
const MISSION = {
  missionType: 'COMPLETE_LESSONS_TWO',
  missionDescription: '레슨 4개 완료하기',
  awardXp: 15,
  progressRate: 0.5,
  isCompleted: false,
};

function renderMission(layout: 'wide' | 'narrow') {
  const Target = () => <DailyMission layout={layout} />;
  return renderWithProviders(Target, { extraPaths: ['/learning', '/my/friends/search'] });
}

describe('DailyMission — 넓은 화면', () => {
  it('설명 · 보상 · 진행률 · 「도전하러 가기」→/learning 을 그린다 (AC-21)', async () => {
    server.use(http.get(MISSION_URL, () => HttpResponse.json(MISSION)));
    await renderMission('wide');

    expect(await screen.findByText('레슨 4개 완료하기')).toBeInTheDocument();
    expect(screen.getByText('완료 시 +15 XP')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: '진행률' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '도전하러 가기' })).toHaveAttribute(
      'href',
      '/learning',
    );
  });

  it('FOLLOW_NEW_FRIEND 면 CTA 가 /my/friends/search 로 간다 (AC-20)', async () => {
    server.use(
      http.get(MISSION_URL, () =>
        HttpResponse.json({ ...MISSION, missionType: 'FOLLOW_NEW_FRIEND' }),
      ),
    );
    await renderMission('wide');

    expect(await screen.findByRole('link', { name: '도전하러 가기' })).toHaveAttribute(
      'href',
      '/my/friends/search',
    );
  });

  it('완료된 미션은 CTA 가 비활성 「미션 완료」 버튼이다 (AC-22)', async () => {
    server.use(http.get(MISSION_URL, () => HttpResponse.json({ ...MISSION, isCompleted: true })));
    await renderMission('wide');

    expect(await screen.findByRole('button', { name: '미션 완료' })).toBeDisabled();
    expect(screen.queryByRole('link', { name: '도전하러 가기' })).not.toBeInTheDocument();
  });

  it('로딩 중에는 제목이 보이고 본문은 aria-busy 다 (AC-24)', async () => {
    server.use(http.get(MISSION_URL, () => new Promise(() => {})));
    await renderMission('wide');

    expect(screen.getByRole('heading', { name: '오늘의 미션' })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="mission-card-body"]')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('실패하면 「오늘의 미션을 불러오지 못했어요.」 + 「다시 시도」로 1회만 재요청한다 (AC-23)', async () => {
    let requests = 0;
    server.use(
      http.get(MISSION_URL, () => {
        requests += 1;
        return requests === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(MISSION);
      }),
    );
    await renderMission('wide');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('오늘의 미션을 불러오지 못했어요.');

    await userEvent.click(within(alert).getByRole('button', { name: '다시 시도' }));

    await waitFor(() => expect(screen.getByText('레슨 4개 완료하기')).toBeInTheDocument());
    expect(requests).toBe(2);
  });
});

describe('DailyMission — 좁은 화면', () => {
  it('CTA 없이 카드 전체가 /learning 링크다 (AC-21)', async () => {
    server.use(http.get(MISSION_URL, () => HttpResponse.json(MISSION)));
    await renderMission('narrow');

    expect(
      await screen.findByRole('link', { name: '레슨 4개 완료하기 도전하러 가기' }),
    ).toHaveAttribute('href', '/learning');
    expect(screen.queryByRole('link', { name: '도전하러 가기' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /미션/ })).not.toBeInTheDocument();
  });

  it('완료된 미션은 카드가 링크가 아니다 (AC-22)', async () => {
    server.use(http.get(MISSION_URL, () => HttpResponse.json({ ...MISSION, isCompleted: true })));
    await renderMission('narrow');

    expect(await screen.findByText('레슨 4개 완료하기')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
