import { useNavigate } from '@tanstack/react-router';

import { SocialFriendsFeedSection } from '@/widgets/social/friend-feed';
import { SocialFollowSection } from '@/widgets/social/follow';
import { SocialRecommendFriendSection } from '@/widgets/social/recommend-friends';

/**
 * 마이페이지 소셜 탭. 팔로우 · 친구 활동 피드 · 추천 친구 섹션을 배치한다.
 * 모바일에서 팔로우 수 클릭 시 별도 친구 페이지(/friends)로 이동시킨다.
 */
export function SocialTab() {
  const navigate = useNavigate();

  return (
    <section aria-label="소셜" className="flex flex-col gap-4 md:gap-6">
      <SocialFollowSection
        onOpenFollowPage={(tab) => navigate({ to: '/friends', search: { tab } })}
      />
      <SocialFriendsFeedSection />
      <SocialRecommendFriendSection />
    </section>
  );
}
