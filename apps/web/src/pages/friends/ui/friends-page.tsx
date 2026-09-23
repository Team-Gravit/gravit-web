import { useEffect, useRef } from 'react';

import { type FollowType, useFollowCount } from '@/entities/follow';
import { PageTitleBar } from '@/widgets/page-title-bar';
import { FollowListContainer, FollowListTab } from '@/widgets/social/follow';

interface FriendsPageProps {
  activeTab: FollowType;
  onChangeTab: (tab: FollowType) => void;
}

/**
 * 친구(팔로워/팔로잉) 전체 화면. 마이페이지와 별개 경로(/friends)로, 프로필·섹션탭 없이
 * 공통 PageTitleBar(뒤로 → 소셜 탭) + 탭 + 목록만 보여준다. 활성 탭은 URL search로 관리한다.
 */
export function FriendsPage({ activeTab, onChangeTab }: FriendsPageProps) {
  const { data } = useFollowCount();
  const mainRef = useRef<HTMLElement>(null);

  // 탭을 바꾸면 다른 목록으로 교체되므로 앱 셸 스크롤을 맨 위로 되돌린다.
  useEffect(() => {
    mainRef.current?.closest('.overflow-y-auto')?.scrollTo({ top: 0 });
  }, [activeTab]);

  return (
    <main ref={mainRef} className="flex min-h-full flex-col bg-bg-1">
      <PageTitleBar title="친구" backTo={{ to: '/my/social' }} />

      {data && (
        <>
          <div className="p-4 pt-5">
            <FollowListTab
              activeTab={activeTab}
              onTabChange={onChangeTab}
              followerCount={data.followerCount}
              followingCount={data.followingCount}
            />
          </div>
          <FollowListContainer type={activeTab} />
        </>
      )}
    </main>
  );
}
