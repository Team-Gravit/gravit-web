import { useState } from 'react';

import {
  mapToLeagueUser,
  mapToTierInfo,
  tiers,
  useLeagueInfo,
  useLeagueRanking,
  useMyLeagueRanking,
  type LeagueUser,
} from '@/entities/league';

import { RankingList } from './ranking-list';
import { SeasonTimer } from './season-timer';
import { TierSelector } from './tier-selector';

export interface LeagueArenaProps {
  seasonName: string;
  /** 내가 속한 티어의 leagueId. 초기 선택값이자 내 티어 랭킹 조회 분기 기준. */
  myLeagueId: number;
}

/**
 * 시즌 헤더·티어 셀렉터·랭킹 리스트를 조립한 리그 아레나.
 * 모바일: 헤더(pt-40 pb-24) 아래 상단 divider 랭킹(pt-24 px-16). 데스크톱: 좌우 2단.
 */
export function LeagueArena({ seasonName, myLeagueId }: LeagueArenaProps) {
  const [selectedTierId, setSelectedTierId] = useState(myLeagueId);
  const isMyTier = selectedTierId === myLeagueId;

  const tierInfoQuery = useLeagueInfo(selectedTierId);
  const myRanking = useMyLeagueRanking(isMyTier);
  const tierRanking = useLeagueRanking(selectedTierId, !isMyTier);
  const ranking = isMyTier ? myRanking : tierRanking;

  const users: LeagueUser[] =
    ranking.data?.pages.flatMap((page) => page.contents.map(mapToLeagueUser)) ?? [];
  const selectedTierInfo = tierInfoQuery.data ? mapToTierInfo(tierInfoQuery.data) : undefined;

  return (
    <div className="flex h-full min-h-0 w-full flex-col md:flex-row md:justify-center md:gap-[72px]">
      <section className="flex shrink-0 flex-col items-center gap-6 pt-10 pb-6 md:w-auto md:max-w-[731px] md:gap-10 md:py-0">
        <SeasonTimer seasonName={seasonName} />
        <TierSelector
          tiers={tiers}
          selectedTierId={selectedTierId}
          onSelectTier={setSelectedTierId}
          selectedTierInfo={selectedTierInfo}
        />
      </section>

      {/* 페이지는 고정, 이 영역만 세로 스크롤. flex-1 min-h-0 으로 남은 높이를 채운다. */}
      <section className="flex min-h-0 flex-1 flex-col border-t border-bg-4 px-4 pt-6 md:w-[664px] md:flex-none md:border-0 md:px-0 md:pt-0">
        <RankingList
          users={users}
          hasNextPage={Boolean(ranking.hasNextPage)}
          isFetchingNextPage={ranking.isFetchingNextPage}
          onLoadMore={ranking.fetchNextPage}
          isLoading={ranking.isLoading}
        />
      </section>
    </div>
  );
}
