import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { useGetFollowAndFollowingCount } from '@/shared/api/@generated/friend-api/friend-api';
import useResponsive from '@/shared/model/use-responsive';
import SectionCard from '@/shared/ui/card/section-card';
import StatItem from '@/shared/ui/stat/stat-item';
import FollowModal from '@/widgets/user/follow/follow-modal';

interface SocialFollowSectionViewProps {
  followerCount: number;
  followingCount: number;
}

function SocialFollowSection() {
  const { data, isPending: isGetFollowCountPending } = useGetFollowAndFollowingCount();

  if (isGetFollowCountPending || !data) return null;

  return (
    <SocialFollowSectionView
      followerCount={data.followerCount ?? 0}
      followingCount={data.followingCount ?? 0}
    />
  );
}

function SocialFollowSectionView({ followerCount, followingCount }: SocialFollowSectionViewProps) {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null);

  const handleClickFollowButton = (type: 'followers' | 'following') => {
    if (isMobile) {
      navigate({ to: '/my/follow', search: { tab: type } });
      return;
    }

    setFollowModal(type);
  };

  return (
    <>
      <SectionCard
        title="팔로우"
        description="나와 함께 학습하는 사람들"
        headerClassName="hidden md:flex"
      >
        <div className="flex items-center justify-center md:gap-6 ">
          <StatItem
            onClick={() => handleClickFollowButton('followers')}
            label="팔로우"
            value={followerCount.toString()}
          />

          <div aria-hidden className="md:hidden w-px h-10 shrink-0 bg-divider-1" />
          <StatItem
            onClick={() => handleClickFollowButton('following')}
            label="팔로잉"
            value={followingCount.toString()}
          />
        </div>
      </SectionCard>

      {followModal && (
        <FollowModal
          isOpen={!!followModal}
          activeTab={followModal}
          onClose={() => setFollowModal(null)}
          followerCount={followerCount}
          followingCount={followingCount}
        />
      )}
    </>
  );
}

export default SocialFollowSection;
