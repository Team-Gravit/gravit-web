import { Outlet, createFileRoute } from '@tanstack/react-router';

import { Header } from '@/widgets/header';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsShell,
});

/**
 * 설정 셸. 앱 셸과 달리 하단 탭이 없고 데스크톱 헤더는 항상 solid다.
 * 좁은 화면 상단은 각 페이지의 `PageTitleBar`가 담당한다. 콘텐츠 영역이 스크롤을 소유해
 * `PageTitleBar`의 sticky 고정이 동작한다.
 */
function SettingsShell() {
  return (
    <div className="h-dvh overflow-hidden">
      {/* 고정 헤더 뒤 영역까지 회색으로 채워 흰/회색 seam을 없앤다 (_app-shell과 동일). */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-bg-2" />

      <div className="hidden md:block">
        <Header variant="solid" />
      </div>

      <div className="h-full overflow-y-auto md:pt-(--desktop-header-height)">
        <Outlet />
      </div>
    </div>
  );
}
