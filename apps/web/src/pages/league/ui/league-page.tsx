import { type ReactNode, useState } from 'react';

import { useRefetchActiveQueries } from '@/shared/api';
import { PullToRefresh } from '@/shared/ui/pull-to-refresh';
import { useLeagueHome, useMyLeagueProfile } from '@/entities/league';
import { LeagueArena } from '@/widgets/league-arena';
import { LeagueSeasonModal } from '@/widgets/league-season-modal';

import LeagueBgDesktop from './assets/league-bg-desktop.png';
import LeagueBgMobile from './assets/league-bg-mobile.png';

const BACKGROUND_GRADIENT = 'linear-gradient(197deg, #4721ca 3.6%, #17034e 95%)';

/**
 * 리그 화면. 배경을 깔고, 당겨서 새로고침으로 감싼 내용을 배치한다.
 *
 * 배경은 PullToRefresh 밖에 둔다. 안에 두면 당기는 동안 걸리는 transform 때문에 `fixed` 배경이
 * 화면 대신 감싼 영역을 기준으로 놓여 함께 내려간다.
 */
export function LeaguePage() {
  const refetchActiveQueries = useRefetchActiveQueries();

  return (
    <>
      <LeagueBackground />
      <PullToRefresh onRefresh={refetchActiveQueries} className="h-full" isUnderStatusBar>
        <LeagueContent />
      </PullToRefresh>
    </>
  );
}

/** 로딩/에러 분기와 시즌 모달을 결정하고 아레나를 배치한다. */
function LeagueContent() {
  const homeQuery = useLeagueHome();
  const profileQuery = useMyLeagueProfile();

  const [hasClosedSeasonModal, setHasClosedSeasonModal] = useState(false);

  // isPending은 성공한 데이터가 없을 때만 참이다. 재조회 중에는 기존 화면을 유지한다.
  if (profileQuery.isPending || homeQuery.isPending) {
    return <StatusScreen>로딩중</StatusScreen>;
  }
  if (profileQuery.isError || homeQuery.isError) {
    return <StatusScreen>에러 발생</StatusScreen>;
  }

  const home = homeQuery.data;
  const profile = profileQuery.data;
  const seasonPopup =
    home.containsPopup && !hasClosedSeasonModal ? home.lastSeasonPopupDto : undefined;

  function handleSeasonModalComplete() {
    setHasClosedSeasonModal(true);
  }

  // overlay 헤더(투명)가 배경 위에 겹치되 아레나 콘텐츠는 가리지 않도록, 데스크톱에서 헤더 높이만큼
  // 상단 여백을 둔다. 배경은 fixed 라 이 padding 에 영향받지 않고 헤더 뒤까지 full-bleed 유지된다.
  return (
    <main className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-(--safe-area-top) md:px-10 md:pb-[clamp(16px,8vh,64px)] md:pt-[calc(var(--desktop-header-height)+clamp(16px,10vh,100px))]">
      <div className="flex min-h-0 flex-1 flex-col">
        <LeagueArena seasonName={home.currentSeason.nowSeason} myLeagueId={profile.leagueId} />
      </div>

      {seasonPopup && (
        <LeagueSeasonModal popup={seasonPopup} onComplete={handleSeasonModalComplete} />
      )}
    </main>
  );
}

function LeagueBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ backgroundImage: BACKGROUND_GRADIENT }}
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={LeagueBgDesktop} />
        <img src={LeagueBgMobile} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <div aria-hidden className="absolute inset-0 bg-[#000000]/45" />
    </div>
  );
}

function StatusScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-1 items-center justify-center text-body1-normal text-text-1-w">
      {children}
    </div>
  );
}
