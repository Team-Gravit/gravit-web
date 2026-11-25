import { useState } from 'react';

import { type FollowType, useFollowCount } from '@/entities/follow';
import { useIsWideViewport } from '@/shared/lib/use-is-wide-viewport';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { StatItem } from '@/shared/ui/stat-item';

import { FollowModal } from './follow-modal';

const CARD_CLASS =
  'gap-4 rounded-8 bg-white px-4 py-5 shadow-elevation-1 md:gap-6 md:rounded-12 md:bg-bg-1 md:px-8 md:py-7';

// 데스크톱은 각 통계를 별도 박스로 감싼다(시안). 모바일은 박스 없이 구분선으로 나눈다.
const STAT_ITEM_CLASS =
  'md:h-[132px] md:rounded-8 md:border md:border-[#fbf1ff]/60 md:bg-bg-2 md:p-8';

interface SocialFollowSectionProps {
  /** 모바일에서 팔로우 수 클릭 시 이동할 목적지. 라우팅은 상위(페이지)가 정한다. */
  onOpenFollowPage?: (tab: FollowType) => void;
}

/**
 * 팔로우/팔로잉 수 카드. 데스크톱은 클릭 시 모달, 모바일은 페이지로 이동한다.
 * 로딩 중에는 스켈레톤 대신 초기값 0을 보여주고(숫자만 갱신되어 시프트가 없다), 에러만 재시도로 바꾼다.
 */
export function SocialFollowSection({ onOpenFollowPage }: SocialFollowSectionProps) {
  const isWide = useIsWideViewport();
  const [modalTab, setModalTab] = useState<FollowType | null>(null);
  const { data, isPending, isError, refetch } = useFollowCount();

  const handleClick = (type: FollowType) => {
    // 로딩·에러로 아직 수치가 없으면 상호작용하지 않는다.
    if (!data) {
      return;
    }
    if (isWide) {
      setModalTab(type);
      return;
    }
    onOpenFollowPage?.(type);
  };

  return (
    <>
      <Card className={CARD_CLASS} aria-busy={isPending || undefined}>
        {/* 헤더는 데스크톱에서만 노출(시안) */}
        <div className="hidden flex-col gap-2 md:flex">
          <p className="text-body1-normal text-text-4">팔로우</p>
          <p className="text-title3 text-text-1">나와 함께 학습하는 사람들</p>
        </div>

        {isError ? (
          <CardRetryStatus
            className="py-8"
            sectionName="팔로우 정보"
            onRetry={() => refetch({ throwOnError: true })}
          />
        ) : (
          <div className="flex items-center md:gap-6">
            <StatItem
              onClick={() => handleClick('followers')}
              value={String(data?.followerCount ?? 0)}
              label="팔로우"
              className={STAT_ITEM_CLASS}
            />
            <div aria-hidden className="h-10 w-px shrink-0 bg-divider-1 md:hidden" />
            <StatItem
              onClick={() => handleClick('following')}
              value={String(data?.followingCount ?? 0)}
              label="팔로잉"
              className={STAT_ITEM_CLASS}
            />
          </div>
        )}
      </Card>

      {modalTab && data && (
        <FollowModal
          open
          onClose={() => setModalTab(null)}
          initialTab={modalTab}
          followerCount={data.followerCount}
          followingCount={data.followingCount}
        />
      )}
    </>
  );
}
