import { useState } from 'react';

import type { FollowType } from '@/entities/follow/model/types';
import X from '@/shared/assets/icons/buttons/x.svg?react';

import FollowListContainer from './follow-list-container';
import FollowListTab from './follow-list-tab';

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: FollowType;
  followerCount: number;
  followingCount: number;
}

export default function FollowModal({
  isOpen,
  onClose,
  activeTab: initialTab,
  followerCount,
  followingCount,
}: FollowModalProps) {
  const [currentTab, setCurrentTab] = useState<FollowType>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-bg-1 w-full max-w-[630px] max-h-[80vh] rounded-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-divider-1">
          <h2 className="text-text-4 text-body1-normal">팔로우</h2>
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center p-1.5"
          >
            <X />
          </button>
        </div>

        <FollowListTab
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
          followerCount={followerCount}
          followingCount={followingCount}
        />

        <div className="h-[400px] py-4 overflow-scroll scrollbar-hide">
          <FollowListContainer type={currentTab} />
        </div>
      </div>
    </div>
  );
}
