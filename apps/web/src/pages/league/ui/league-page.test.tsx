import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';

import { server } from '@/shared/api/mocks/server';

import { LeaguePage } from './league-page';

// 아레나와 시즌 모달은 각자 쿼리·측정 로직이 있어 화면 분기만 보도록 대체한다.
vi.mock('@/widgets/league-arena', () => ({
  LeagueArena: ({ myLeagueId }: { myLeagueId: number }) => <p>아레나 {myLeagueId}</p>,
}));
vi.mock('@/widgets/league-season-modal', () => ({
  LeagueSeasonModal: ({ onComplete }: { onComplete: () => void }) => (
    <button type="button" onClick={onComplete}>
      시즌 팝업 닫기
    </button>
  ),
}));

const HOME_URL = '*/api/v1/league/home';
const PROFILE_URL = '*/api/v1/ranking/me';

const HOME = { containsPopup: false, currentSeason: { nowSeason: '2026-41' } };
const POPUP_HOME = {
  containsPopup: true,
  currentSeason: { nowSeason: '2026-41' },
  lastSeasonPopupDto: {},
};
const PROFILE = {
  leagueId: 4,
  leagueName: '실버 3',
  rank: 2,
  userId: 1,
  lp: 31,
  maxLp: 99,
  nickname: '땅콩',
  profileImgNumber: 3,
  xp: 10,
  level: 1,
};

function renderLeaguePage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <LeaguePage />
    </QueryClientProvider>,
  );
  return queryClient;
}

describe('LeaguePage', () => {
  it('데이터가 오기 전에는 「로딩중」을 보여준다', () => {
    server.use(
      http.get(HOME_URL, () => HttpResponse.json(HOME)),
      http.get(PROFILE_URL, () => HttpResponse.json(PROFILE)),
    );

    renderLeaguePage();

    expect(screen.getByText('로딩중')).toBeInTheDocument();
  });

  it('다시 불러오는 동안에도 아레나를 유지한다', async () => {
    let profileRequestCount = 0;
    let respondToRefetch = () => {};
    const refetchResponded = new Promise<void>((resolve) => {
      respondToRefetch = resolve;
    });
    server.use(
      http.get(HOME_URL, () => HttpResponse.json(HOME)),
      http.get(PROFILE_URL, async () => {
        profileRequestCount += 1;
        if (profileRequestCount === 1) {
          return HttpResponse.json(PROFILE);
        }
        await refetchResponded;
        return HttpResponse.json({ ...PROFILE, leagueId: 5 });
      }),
    );
    const queryClient = renderLeaguePage();
    expect(await screen.findByText('아레나 4')).toBeInTheDocument();

    const refetch = queryClient.refetchQueries({ type: 'active' });
    await waitFor(() => expect(profileRequestCount).toBe(2));
    expect(screen.queryByText('로딩중')).not.toBeInTheDocument();
    expect(screen.getByText('아레나 4')).toBeInTheDocument();

    respondToRefetch();
    await act(() => refetch);
    expect(await screen.findByText('아레나 5')).toBeInTheDocument();
  });

  it('요청이 실패하면 「에러 발생」을 보여준다', async () => {
    server.use(
      http.get(HOME_URL, () => new HttpResponse(null, { status: 500 })),
      http.get(PROFILE_URL, () => HttpResponse.json(PROFILE)),
    );

    renderLeaguePage();

    expect(await screen.findByText('에러 발생')).toBeInTheDocument();
  });

  it('배경은 768px 이상에서 데스크톱 이미지로 바꾸고 어두운 덮개를 하나 깐다', () => {
    server.use(
      http.get(HOME_URL, () => HttpResponse.json(HOME)),
      http.get(PROFILE_URL, () => HttpResponse.json(PROFILE)),
    );

    renderLeaguePage();

    const picture = document.querySelector('picture');
    const desktopSources = picture?.querySelectorAll('source[media="(min-width: 768px)"]');
    expect(desktopSources).toHaveLength(2);
    expect(picture?.querySelector('img')).toHaveAttribute('alt', '');
    expect(picture?.parentElement?.querySelectorAll(':scope > div')).toHaveLength(1);
  });

  it('시즌 팝업을 닫으면 다시 불러와도 뜨지 않는다', async () => {
    server.use(
      http.get(HOME_URL, () => HttpResponse.json(POPUP_HOME)),
      http.get(PROFILE_URL, () => HttpResponse.json(PROFILE)),
    );
    const queryClient = renderLeaguePage();

    await userEvent.click(await screen.findByRole('button', { name: '시즌 팝업 닫기' }));
    await act(() => queryClient.refetchQueries({ type: 'active' }));

    expect(screen.queryByRole('button', { name: '시즌 팝업 닫기' })).not.toBeInTheDocument();
  });
});
