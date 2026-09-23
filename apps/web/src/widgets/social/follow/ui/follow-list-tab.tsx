import type { FollowType } from '@/entities/follow';
import { cn } from '@/shared/lib/cn';

interface FollowListTabProps {
  activeTab: FollowType;
  onTabChange: (tab: FollowType) => void;
  followerCount: number;
  followingCount: number;
}

const TAB_CLASS = cn(
  'flex flex-1 items-center justify-center border-b py-3 transition-colors md:border-b-2 md:py-4',
  'text-label1 text-text-4 md:text-body1-normal',
  'aria-selected:border-b-2 aria-selected:border-main aria-selected:text-main md:aria-selected:text-heading2',
);

/** 팔로워/팔로잉 전환 탭. 활성 탭은 main 밑줄이며 수와 라벨을 함께 보여준다. */
export function FollowListTab({
  activeTab,
  onTabChange,
  followerCount,
  followingCount,
}: FollowListTabProps) {
  return (
    <div role="tablist" className="flex w-full">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'followers'}
        className={TAB_CLASS}
        onClick={() => onTabChange('followers')}
      >
        <span className="mr-2 text-label1 md:text-heading2">{followerCount}</span>
        팔로우
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'following'}
        className={TAB_CLASS}
        onClick={() => onTabChange('following')}
      >
        <span className="mr-2 text-label1 md:text-heading2">{followingCount}</span>
        팔로잉
      </button>
    </div>
  );
}
