import { Outlet, createFileRoute, useMatches } from '@tanstack/react-router';

import { cn } from '@/shared/lib/cn';
import { BottomTabBar } from '@/widgets/bottom-tab-bar';
import { Header, type HeaderVariant } from '@/widgets/header';

export const Route = createFileRoute('/_authenticated/_app-shell')({
  component: AppShell,
});

/**
 * 가장 깊은 라우트의 `headerVariant`를 사용하고, 없으면 부모 값을 거슬러 올라가 상속한다.
 * 어느 라우트에도 지정되지 않았으면 `solid`를 사용한다.
 */
function AppShell() {
  const matches = useMatches();
  const headerVariant: HeaderVariant =
    [...matches].reverse().find((match) => match.staticData.headerVariant)?.staticData
      .headerVariant ?? 'solid';

  return (
    <div className="h-dvh overflow-hidden">
      {/*
        앱 캔버스 배경. 블록 배경색(bg-bg-2)이 아니라 전용 -z-20 레이어로 둔다.
        - 일반 페이지: 이 회색이 콘텐츠 뒤(고정 헤더 뒤 영역 포함)로 비쳐 흰/회색 seam을 없앤다.
        - full-bleed 배경 페이지(리그): 자기 배경(-z-10)이 이 위를 덮는다.
        블록 배경으로 칠하면 -z-10 리그 배경을 가려버리므로 레이어로 분리한다.
      */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-bg-2" />

      <div className="hidden md:block">
        <Header variant={headerVariant} />
      </div>

      {/*
        콘텐츠 영역이 앱 셸의 스크롤을 소유한다. 패딩은 고정 바텀탭과 solid 헤더에
        콘텐츠가 가리지 않게 하며, overlay 헤더는 히어로와 겹치도록 상단 패딩을 두지 않는다.
      */}
      <div
        className={cn(
          'h-full overflow-y-auto pb-(--bottom-tab-height) md:pb-0',
          headerVariant === 'solid' && 'md:pt-(--desktop-header-height)',
        )}
      >
        <Outlet />
      </div>

      <div className="md:hidden">
        <BottomTabBar />
      </div>
    </div>
  );
}
