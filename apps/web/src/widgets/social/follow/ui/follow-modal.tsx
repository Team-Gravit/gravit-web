import { useEffect, useState } from 'react';

import type { FollowType } from '@/entities/follow';
import { IconButton } from '@/shared/ui/icon-button';
import { Modal, ModalTitle } from '@/shared/ui/modal';

import { FollowListContainer } from './follow-list-container';
import { FollowListTab } from './follow-list-tab';

interface FollowModalProps {
  open: boolean;
  onClose: () => void;
  initialTab: FollowType;
  followerCount: number;
  followingCount: number;
}

/** 데스크톱 팔로우 모달. 헤더 + 팔로워/팔로잉 탭 + 목록(무한스크롤). */
export function FollowModal({
  open,
  onClose,
  initialTab,
  followerCount,
  followingCount,
}: FollowModalProps) {
  const [tab, setTab] = useState<FollowType>(initialTab);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);

  // 탭을 바꾸면 다른 목록으로 교체되므로 스크롤을 맨 위로 되돌린다.
  useEffect(() => {
    scrollRoot?.scrollTo({ top: 0 });
  }, [tab, scrollRoot]);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
      className="overflow-hidden bg-bg-1 p-0"
    >
      <div className="flex items-center justify-between border-b border-divider-1 px-6 py-5">
        <ModalTitle className="text-body1-normal text-text-4">팔로우</ModalTitle>
        <IconButton icon="close-md" onClick={onClose} aria-label="닫기" />
      </div>

      <div className="space-y-4">
        <FollowListTab
          activeTab={tab}
          onTabChange={setTab}
          followerCount={followerCount}
          followingCount={followingCount}
        />

        <div ref={setScrollRoot} className="h-100 overflow-y-auto pb-2">
          <FollowListContainer type={tab} scrollRoot={scrollRoot} />
        </div>
      </div>
    </Modal>
  );
}
