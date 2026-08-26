import { useState } from 'react';

import type { FollowType } from '@/entities/follow/model/types';
import Modal from '@/shared/ui/modal/compound-modal';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="팔로우" />
      <FollowListTab
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        followerCount={followerCount}
        followingCount={followingCount}
      />
      <Modal.Content className="h-[400px]">
        <FollowListContainer type={currentTab} />
      </Modal.Content>
    </Modal>
  );
}
