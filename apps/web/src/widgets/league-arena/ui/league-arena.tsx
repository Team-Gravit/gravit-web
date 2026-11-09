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

import { useScaleToFit } from '../lib/use-scale-to-fit';
import { RankingList } from './ranking-list';
import { SeasonTimer } from './season-timer';
import { TierSelector } from './tier-selector';

export interface LeagueArenaProps {
  seasonName: string;
  /** 내가 속한 티어의 leagueId. 직접 고른 티어가 없을 때의 선택값이자 내 티어 랭킹 조회 분기 기준. */
  myLeagueId: number;
  /** 내 현재 등수. 내 티어 랭킹의 앵커 페이지(진입 시 센터링 대상)를 정한다. */
  myRank: number;
  /** 내 userId. 랭킹 목록에서 내 행을 찾아 중앙으로 스크롤한다. */
  myUserId: number;
}

/** 내 티어를 기본으로 보여 주고, 직접 고른 티어는 내 리그가 바뀌어도 유지한다. */
export function LeagueArena({ seasonName, myLeagueId, myRank, myUserId }: LeagueArenaProps) {
  // 기본 티어를 state에 복사하면 프로필 재조회 후에도 이전 티어에 머문다.
  const [pickedTierId, setPickedTierId] = useState<number | null>(null);
  const selectedTierId = pickedTierId ?? myLeagueId;
  const isMyTier = selectedTierId === myLeagueId;

  // 센터링 애니메이션은 화면에 처음 들어왔을 때(아직 티어를 고르지 않은 초기 내 티어 뷰)만 보여준다.
  // 티어를 한 번이라도 고른 뒤의 내 티어 재진입에서는 즉시 점프한다 — 반복 애니메이션은 거슬리고,
  // 빠른 전환 중 비동기 애니메이션이 끊기는 문제도 없앤다.
  const animateCentering = isMyTier && pickedTierId === null;

  const tierInfoQuery = useLeagueInfo(selectedTierId);
  const myRankingQuery = useMyLeagueRanking(myRank, isMyTier);
  const tierRankingQuery = useLeagueRanking(selectedTierId, !isMyTier);
  const rankingQuery = isMyTier ? myRankingQuery : tierRankingQuery;

  const users: LeagueUser[] =
    rankingQuery.data?.pages.flatMap((page) => page.contents.map(mapToLeagueUser)) ?? [];
  const selectedTierInfo = tierInfoQuery.data ? mapToTierInfo(tierInfoQuery.data) : undefined;

  // ponytail: 아레나(좌측 컬럼 + 랭킹)를 한 덩어리로 가용 높이에 맞춰 통째 균일 축소. 좌측 콘텐츠 자연높이가
  // 높이 기준(stage 높이)이고, 랭킹 리스트는 거기에 묶여 내부 스크롤 유지(행 수와 무관해 측정 안정적).
  const { containerRef, contentRef, stageStyle } = useScaleToFit();

  return (
    <div ref={containerRef} className="relative h-full min-h-0 w-full overflow-hidden">
      <div
        className="flex h-full w-full flex-col md:flex-row md:justify-center md:gap-[72px]"
        style={stageStyle}
      >
        <section className="flex shrink-0 flex-col items-center pt-10 pb-6 md:w-auto md:max-w-[731px] md:py-0">
          <div ref={contentRef} className="flex flex-col items-center gap-6 md:gap-10">
            <SeasonTimer seasonName={seasonName} />
            <TierSelector
              tiers={tiers}
              selectedTierId={selectedTierId}
              onSelectTier={setPickedTierId}
              selectedTierInfo={selectedTierInfo}
            />
          </div>
        </section>

        {/* 랭킹만 내부 세로 스크롤. stage 높이에 묶여 아레나와 같은 비율로 함께 축소된다. */}
        <section className="flex min-h-0 flex-1 flex-col border-t border-bg-4 px-4 md:w-[664px] md:min-w-[400px]  md:border-0 md:px-0 md:pt-0">
          <RankingList
            // 티어가 바뀌면 remount해 스크롤·센터링 상태를 초기화한다. 내 티어로 돌아오면 내 순위로
            // 다시 센터링되고, 다른 티어는 맨 위에서 시작한다. 데이터는 Query 캐시라 재요청은 없다.
            key={selectedTierId}
            users={users}
            hasNextPage={Boolean(rankingQuery.hasNextPage)}
            isFetchingNextPage={rankingQuery.isFetchingNextPage}
            onLoadMore={rankingQuery.fetchNextPage}
            isLoading={rankingQuery.isLoading}
            // 내 티어일 때만 센터 모드: 내 행을 중앙에 띄우고 위로도 더 불러온다.
            myUserId={isMyTier ? myUserId : undefined}
            hasPreviousPage={Boolean(myRankingQuery.hasPreviousPage)}
            isFetchingPreviousPage={myRankingQuery.isFetchingPreviousPage}
            onLoadPrevious={myRankingQuery.fetchPreviousPage}
            animateCentering={animateCentering}
          />
        </section>
      </div>
    </div>
  );
}
