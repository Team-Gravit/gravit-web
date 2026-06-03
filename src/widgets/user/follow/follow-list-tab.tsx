import type { FollowType } from '@/entities/follow/model/types';
import { cn } from '@/shared/lib/cn';

interface FollowListTabProps {
  activeTab: FollowType;
  setActiveTab: (tab: FollowType) => void;
  followerCount: number;
  followingCount: number;
}

export default function FollowListTab({
  activeTab,
  setActiveTab,
  followerCount,
  followingCount,
}: FollowListTabProps) {
  // TODO : 타이포 수정
  const commonTabStyle = cn(
    'border-b md:border-b-2 flex-1 flex items-center justify-center py-[11.5px] md:py-4 transition-colors duration-300',
    'text-label1 md:text-body1-normal text-text-3-w',
    'aria-[selected=true]:border-b-2 aria-[selected=true]:border-main-1 aria-[selected=true]:text-main-1 md:aria-[selected=true]:text-heading2',
  );

  return (
    <div role="tablist" className="flex w-full ">
      <button
        role="tab"
        type="button"
        aria-selected={activeTab === 'followers'}
        className={cn(commonTabStyle)}
        onClick={() => setActiveTab('followers')}
      >
        <span className="md:text-heading2 text-label1 mr-2">{followerCount}</span>
        팔로우
      </button>

      <button
        role="tab"
        type="button"
        aria-selected={activeTab === 'following'}
        className={cn(commonTabStyle)}
        onClick={() => setActiveTab('following')}
      >
        <span className="md:text-heading2 text-label1 mr-2">{followingCount}</span>
        팔로잉
      </button>
    </div>
  );
}
