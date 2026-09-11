import { useState } from 'react';

import { useLeagueHome, useMyLeagueProfile } from '@/entities/league';
import { LeagueArena } from '@/widgets/league-arena';
import { LeagueSeasonModal } from '@/widgets/league-season-modal';

import LeagueBgDesktop from './assets/league-bg-desktop.png';
import LeagueBgMobile from './assets/league-bg-mobile.png';

const BACKGROUND_GRADIENT = 'linear-gradient(197deg, #4721ca 3.6%, #17034e 95%)';

/** 리그 화면. 로딩/에러 분기와 시즌 모달을 결정하고 아레나를 배치한다. */
export function LeaguePage() {
  const homeQuery = useLeagueHome();
  const profileQuery = useMyLeagueProfile();

  const [modalChecked, setModalChecked] = useState(false);

  if (profileQuery.isFetching || homeQuery.isLoading) return <StatusScreen>로딩중</StatusScreen>;
  if (profileQuery.isError || homeQuery.isError) return <StatusScreen>에러 발생</StatusScreen>;
  if (!profileQuery.data || !homeQuery.data) return <StatusScreen>데이터 없음</StatusScreen>;

  const home = homeQuery.data;
  const profile = profileQuery.data;

  const shouldShowSeasonModal =
    home.containsPopup && Boolean(home.lastSeasonPopupDto) && !modalChecked;

  return (
    <div className="relative flex h-svh w-full flex-col overflow-hidden md:px-10 md:py-16">
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ backgroundImage: BACKGROUND_GRADIENT }}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={LeagueBgDesktop} />
          <img
            src={LeagueBgMobile}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div aria-hidden className="absolute inset-0 bg-[#000000]/45" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <LeagueArena seasonName={home.currentSeason.nowSeason} myLeagueId={profile.leagueId} />
      </div>

      {shouldShowSeasonModal && home.lastSeasonPopupDto && (
        <LeagueSeasonModal
          popup={home.lastSeasonPopupDto}
          onComplete={() => setModalChecked(true)}
        />
      )}
    </div>
  );
}

function StatusScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center text-body1-normal text-text-1-w">
      {children}
    </div>
  );
}
