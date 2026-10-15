import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useLeagueInfo, useMyLeagueRanking } from '@/entities/league';

import { LeagueArena } from './league-arena';

const EMPTY_RANKING = {
  data: undefined,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: () => {},
  isLoading: false,
};

// 티어 정보 조회와 내 랭킹 조회 분기만 확인한다. 화면 축소 측정은 대체한다.
vi.mock('@/entities/league', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/league')>()),
  useLeagueInfo: vi.fn(() => ({ data: undefined })),
  useMyLeagueRanking: vi.fn(() => EMPTY_RANKING),
  useLeagueRanking: vi.fn(() => EMPTY_RANKING),
}));
vi.mock('../lib/use-scale-to-fit', () => ({
  useScaleToFit: () => ({ containerRef: { current: null }, contentRef: { current: null } }),
}));

function getRequestedTierId() {
  return vi.mocked(useLeagueInfo).mock.lastCall?.[0];
}

describe('LeagueArena', () => {
  beforeEach(() => {
    // jsdom 에는 scrollIntoView 가 없다. 티어 선택기가 선택한 티어를 가운데로 스크롤할 때 쓴다.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('티어를 고르지 않았으면 myLeagueId 가 바뀔 때 선택도 따라간다', () => {
    const { rerender } = render(<LeagueArena seasonName="2026-41" myLeagueId={4} />);
    expect(getRequestedTierId()).toBe(4);

    rerender(<LeagueArena seasonName="2026-41" myLeagueId={5} />);

    expect(getRequestedTierId()).toBe(5);
    expect(vi.mocked(useMyLeagueRanking).mock.lastCall?.[0]).toBe(true);
  });

  it('직접 고른 티어는 myLeagueId 가 바뀌어도 유지한다', async () => {
    const { rerender } = render(<LeagueArena seasonName="2026-41" myLeagueId={4} />);

    // 티어 버튼은 tiers 순서로 놓인다. 두 번째는 브론즈 2(id 2)다.
    await userEvent.click(screen.getAllByRole('button')[1]);
    rerender(<LeagueArena seasonName="2026-41" myLeagueId={5} />);

    expect(getRequestedTierId()).toBe(2);
    expect(vi.mocked(useMyLeagueRanking).mock.lastCall?.[0]).toBe(false);
  });
});
