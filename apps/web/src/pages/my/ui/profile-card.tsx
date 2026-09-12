import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Skeleton } from '@/shared/ui/skeleton';
import { ProfileAvatar, type MyPageBannerResponse } from '@/entities/user';

import bannerImage from './assets/profile-banner.webp';

interface ProfileCardProps {
  data?: MyPageBannerResponse;
  /**
   * 데이터가 아직 없을 때 데이터 슬롯에 스켈레톤을 노출할지.
   * 지연 노출(빠른 응답 깜빡임 방지)은 호출부에서 제어한다.
   */
  isLoading?: boolean;
}

/** 데이터 슬롯 공통 props. 데이터가 오면 실제 값, 로딩이면 스켈레톤, 그 전엔 빈자리를 그린다. */
interface SlotProps {
  data?: MyPageBannerResponse;
  isLoading: boolean;
}

/**
 * 마이페이지 상단 프로필 배너 카드.
 *
 * 배너 배경·오버레이·레이아웃·정적 액션(편집/설정/알림)은 데이터와 무관한 **프레임**이라 항상 그린다.
 * 데이터에서 오는 슬롯(아바타·닉네임·핸들·라벨)만 실제 값 / 스켈레톤 / 빈자리로 바뀐다.
 * 프레임(이 `section`)이 항상 같은 인스턴스로 유지되므로 로딩→로드에서 remount·시프트가 없다.
 */
export function ProfileCard({ data, isLoading = false }: ProfileCardProps) {
  const slot: SlotProps = { data, isLoading };

  return (
    <section
      aria-label="사용자 프로필 카드"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="relative w-full min-h-[196px] overflow-hidden md:min-h-[204px] md:rounded-12"
    >
      {/* 모바일: 균일한 어둠 오버레이 / 데스크톱: 우측으로 짙어지는 그라데이션 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40 md:hidden" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block md:bg-linear-to-r md:from-[#1d0027]/0 md:from-77% md:to-[#1d0027]/60"
      />

      <div className="relative flex flex-col gap-3 px-4 py-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 md:gap-8">
            <AvatarSlot {...slot} />

            <div className="flex flex-col items-start gap-2">
              <Nickname {...slot} />
              <DesktopHandle {...slot} />
              <LabelRow {...slot} />
            </div>
          </div>

          <ProfileActions />
        </div>

        <MobileHandle {...slot} />

        {/* ponytail: /my/edit 편집 페이지는 별도 작업. 그때 onClick 연결 */}
        <Button variant="secondary" className="h-[37px] w-full text-body2-normal md:hidden">
          프로필 편집
        </Button>
      </div>
    </section>
  );
}

/** 아바타 자리. 데이터와 무관하게 크기를 예약해 내부 시프트를 막는다. */
function AvatarSlot({ data, isLoading }: SlotProps) {
  return (
    <div className="size-[70px] shrink-0 md:size-[140px]">
      {data ? (
        <ProfileAvatar colorNumber={data.profileImageNumber} className="size-full" />
      ) : (
        isLoading && <Skeleton variant="circular" className="size-full bg-white/20" />
      )}
    </div>
  );
}

function Nickname({ data, isLoading }: SlotProps) {
  if (data) {
    return <h3 className="text-heading2 text-text-1-w md:text-display1">{data.nickname}</h3>;
  }
  if (isLoading) {
    return (
      <Skeleton
        variant="text"
        className="w-28 bg-white/20 text-heading2 md:w-60 md:text-display1"
      />
    );
  }
  return null;
}

/** 데스크톱 핸들(프로필 컬럼 내). 모바일에서는 카드 하단의 `MobileHandle`이 담당한다. */
function DesktopHandle({ data, isLoading }: SlotProps) {
  if (data) {
    return (
      <p className="text-body1-normal text-semantic-info max-md:hidden">{`@${data.handle}`}</p>
    );
  }
  if (isLoading) {
    return <Skeleton variant="text" className="w-24 bg-white/20 text-body1-normal max-md:hidden" />;
  }
  return null;
}

function MobileHandle({ data, isLoading }: SlotProps) {
  if (data) {
    return <p className="text-label2 text-semantic-info md:hidden">{`@${data.handle}`}</p>;
  }
  if (isLoading) {
    return <Skeleton variant="text" className="w-24 bg-white/20 text-label2 md:hidden" />;
  }
  return null;
}

/** 레벨·리그·연속학습 라벨. 연속학습은 데스크톱에서만 보인다. */
function LabelRow({ data, isLoading }: SlotProps) {
  if (data) {
    return (
      <div className="flex items-center gap-1 md:gap-2">
        <CardLabel>{`LV. ${data.level}`}</CardLabel>
        <CardLabel>{data.currentLeague}</CardLabel>
        <CardLabel className="max-md:hidden">{`${data.consecutiveSolvedDays}일 연속 학습중`}</CardLabel>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex items-center gap-1 md:gap-2">
        <CardLabelSkeleton className="w-12 md:w-20" />
        <CardLabelSkeleton className="w-16 md:w-24" />
        <CardLabelSkeleton className="w-28 max-md:hidden" />
      </div>
    );
  }
  return null;
}

/**
 * 편집·설정·알림 액션. 데이터와 무관해 항상 렌더한다.
 * 대상 라우트/기능이 아직 없어 현재는 시각 요소만 두고 연결은 별도 작업에서 한다.
 */
function ProfileActions() {
  return (
    <>
      {/* 데스크톱: 프로필 편집 + 설정 */}
      <div className="flex items-center gap-3 text-text-1-w max-md:hidden">
        <Button className="h-[37px] px-5 text-body1-normal">프로필 편집</Button>
        <button type="button" aria-label="설정" className="flex items-center">
          <Icon name="settings" size={32} />
        </button>
      </div>

      {/* 모바일: 알림 + 설정 */}
      <div className="flex items-center gap-4 text-text-1-w md:hidden">
        <button type="button" aria-label="알림" className="flex items-center">
          <Icon name="bell" size={24} />
        </button>
        <button type="button" aria-label="설정" className="flex items-center">
          <Icon name="settings" size={24} />
        </button>
      </div>
    </>
  );
}

function CardLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-8 bg-white/20 px-2 py-1',
        'text-caption1 text-cta-text md:px-4 md:text-headline2',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** CardLabel 과 같은 박스 높이(같은 타이포·패딩)를 가진 스켈레톤. 폭만 className 으로 받는다. */
function CardLabelSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      variant="text"
      className={cn(
        'rounded-8 bg-white/20 px-2 py-1 text-caption1 md:px-4 md:text-headline2',
        className,
      )}
    />
  );
}
