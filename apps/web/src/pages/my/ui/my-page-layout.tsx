import { Outlet } from '@tanstack/react-router';

import { useRefetchActiveQueries } from '@/shared/api';
import { useDelayedFlag } from '@/shared/lib/use-delayed-flag';
import { PullToRefresh } from '@/shared/ui/pull-to-refresh';
import { useMyPageBanner } from '@/entities/user';

import { MyPageTabs } from './my-page-tabs';
import { ProfileCard } from './profile-card';

/*
  당겨서 새로고침할 때 프로필 카드 위로 드러나는 배경.
  1920×274 배너 그림 상자의 윗변 색을 가로로 펼치고 모바일 카드의 어둠 덮개를 얹는다.
  배경 폭 계산에 쓰는 196px은 ProfileCard의 모바일 최소 높이와 맞춘 값이다.
*/
const PULL_TO_REFRESH_BACKGROUND = [
  // 카드 덮개와 같은 순수 검정 40%.
  'linear-gradient(color-mix(in srgb, var(--primitive-gray-1100) 40%, transparent) 0 0)',
  'linear-gradient(90deg, var(--color-space-end) 2.88%, var(--color-space-start) 133.16%) center top / max(100%, calc((196px + var(--safe-area-top)) * 1920 / 274)) 100% no-repeat var(--color-space-end)',
].join(', ');

/**
 * 마이페이지 공통 레이아웃: 프로필 카드 + 섹션 탭 + 하위 탭 콘텐츠(`Outlet`).
 * 앱 셸이 헤더·바텀탭·헤더 offset 을 이미 제공하므로 여기서는 페이지 배경·폭·카드만 담당한다.
 */
export function MyPageLayout() {
  const { data, isPending } = useMyPageBanner();
  // 임계값(기본 300ms)보다 오래 걸릴 때만 데이터 슬롯에 스켈레톤을 띄워 빠른 응답 깜빡임을 막는다.
  const showSkeleton = useDelayedFlag(isPending);
  const refetchActiveQueries = useRefetchActiveQueries();

  return (
    <div className="flex min-h-full flex-col" style={{ background: PULL_TO_REFRESH_BACKGROUND }}>
      <PullToRefresh onRefresh={refetchActiveQueries} className="flex-1" isUnderStatusBar>
        <main className="flex-1 bg-bg-2 md:px-8 md:py-10">
          <div className="mx-auto flex h-full max-w-[1200px] flex-col">
            {/* 로딩·성공에서는 카드 프레임을 유지하고 슬롯만 바뀐다. 에러(로딩 끝+데이터 없음)면 렌더하지 않는다. */}
            {(isPending || data) && <ProfileCard data={data} isLoading={showSkeleton} />}

            <div className="flex flex-1 flex-col gap-5 p-5 md:gap-10 md:p-0 md:pt-10">
              <MyPageTabs />
              <Outlet />
            </div>
          </div>
        </main>
      </PullToRefresh>
    </div>
  );
}
