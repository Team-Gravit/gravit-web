import { Outlet, createFileRoute, useMatches } from '@tanstack/react-router';

import { BottomTabBar } from '@/widgets/bottom-tab-bar';
import { Header, type HeaderVariant } from '@/widgets/header';

export const Route = createFileRoute('/_authenticated/_app-shell')({
  component: AppShell,
});

/**
 * 앱 셸: 데스크톱 헤더(`hidden md:block`)와 모바일 바텀탭(`md:hidden`)을 두르고 콘텐츠를 렌더한다.
 * 헤더 variant는 가장 깊은 매치부터 거슬러 올라가 `staticData.headerVariant`가 지정된 첫 값을 쓴다.
 * → 자식 라우트가 명시하지 않으면 부모 값을 상속한다(기본 solid).
 */
function AppShell() {
  const matches = useMatches();
  const headerVariant: HeaderVariant =
    [...matches].reverse().find((match) => match.staticData.headerVariant)?.staticData
      .headerVariant ?? 'solid';

  return (
    // 앱 캔버스 배경은 셸이 소유한다. 고정 헤더 뒤 영역까지 한 색으로 덮어 흰/회색 seam을 없앤다.
    // full-bleed 배경을 까는 페이지(리그)는 자기 배경으로 이 위를 덮으므로 영향 없다.
    <div className="h-svh overflow-hidden bg-bg-2">
      <div className="hidden md:block">
        <Header variant={headerVariant} />
      </div>

      {/*
        콘텐츠 영역이 뷰포트 높이를 소유하는 스크롤 컨테이너다(box-border라 패딩만큼 안쪽으로 줄어든다).
        - 일반 페이지: 내용이 길면 이 영역이 스크롤된다.
        - 리그처럼 페이지 고정 화면: 자식이 h-full 로 이 영역을 채우고 내부에서만 스크롤한다.
        패딩은 고정 헤더(데스크톱)·바텀탭(모바일)에 콘텐츠가 가리지 않게 준다.
      */}
      <div className="h-svh overflow-y-auto pb-(--bottom-tab-height) md:pt-(--desktop-header-height) md:pb-0">
        <Outlet />
      </div>

      <div className="md:hidden">
        <BottomTabBar />
      </div>
    </div>
  );
}
