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
