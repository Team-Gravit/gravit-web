import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';
import { renderWithProviders } from '@/shared/lib/testing';

import { GrowthSummary } from './growth-summary';

const PROFILE_URL = '*/api/v1/main-pages/profile';
const LEAGUE_URL = '*/api/v1/main-pages/league';
const PROFILE = {
  nickname: '땅콩',
  profileImgNumber: 3,
  userLevelDetailResponse: { level: 1, currentXp: 31, maxXp: 99, levelRate: 0.31 },
};
const LEAGUE = { leagueId: 4, leagueName: '실버 3', currentLP: 31, minLP: 0, maxLP: 99 };

describe('GrowthSummary', () => {
  it('「땅콩」「LV 1」「31 / 99 XP」 · 「실버 3」「31 / 99 LP」, 게이지 31 (AC-9)', async () => {
    server.use(
      http.get(PROFILE_URL, () => HttpResponse.json(PROFILE)),
      http.get(LEAGUE_URL, () => HttpResponse.json(LEAGUE)),
    );
    await renderWithProviders(GrowthSummary);

    expect(await screen.findByText('땅콩')).toBeInTheDocument();
    expect(screen.getByText('LV 1')).toBeInTheDocument();
    expect(await screen.findByText('실버 3')).toBeInTheDocument();

    const [xp, lp] = screen.getAllByText(/\/ 99/);
    expect(xp).toHaveTextContent('31 / 99 XP');
    expect(lp).toHaveTextContent('31 / 99 LP');
    expect(screen.getByRole('progressbar', { name: '경험치' })).toHaveAttribute(
      'aria-valuenow',
      '31',
    );
    expect(screen.getByRole('progressbar', { name: '리그 포인트' })).toHaveAttribute(
      'aria-valuenow',
      '31',
    );
  });

  it('league 만 실패하면 카드 전체가 에러 UI 고, 「다시 시도」는 league 만 재요청한다 (AC-10)', async () => {
    const requests = { profile: 0, league: 0 };
    server.use(
      http.get(PROFILE_URL, () => {
        requests.profile += 1;
        return HttpResponse.json(PROFILE);
      }),
      http.get(LEAGUE_URL, () => {
        requests.league += 1;
        return requests.league === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(LEAGUE);
      }),
    );
    await renderWithProviders(GrowthSummary);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('성장 현황을 불러오지 못했어요.');
    expect(screen.queryByText('땅콩')).not.toBeInTheDocument();

    await userEvent.click(within(alert).getByRole('button', { name: '다시 시도' }));

    await waitFor(() => expect(screen.getByText('실버 3')).toBeInTheDocument());
    expect(requests).toEqual({ profile: 1, league: 2 });
  });
});
