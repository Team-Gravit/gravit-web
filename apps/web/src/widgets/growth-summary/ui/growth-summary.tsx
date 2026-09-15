import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Card, CardRetryStatus } from '@/shared/ui/card';
import { ProgressBar, clampPercent } from '@/shared/ui/progress-bar';
import { Skeleton } from '@/shared/ui/skeleton';
import { ProfileAvatar, useUserProfile, type UserProfile } from '@/entities/user';
import { TierBadge, useLeagueSummary } from '@/entities/league';

export interface GrowthSummaryProps {
  className?: string;
}

/**
 * 프로필과 리그 요청 중 하나라도 실패하면 카드 전체를 오류 상태로 전환한다.
 * 재시도할 때는 실패한 요청만 다시 보낸다.
 */
export function GrowthSummary({ className }: GrowthSummaryProps) {
  const profile = useUserProfile();
  const league = useLeagueSummary();

  const handleRetry = () => {
    if (profile.isError) void profile.refetch();
    if (league.isError) void league.refetch();
  };

  if (profile.isError || league.isError) {
    return (
      <Card data-section="growth-summary" className={className}>
        <CardRetryStatus sectionName="성장 현황" onRetry={handleRetry} />
      </Card>
    );
  }

  const isPending = profile.isPending || league.isPending;

  return (
    <Card
      data-section="growth-summary"
      aria-busy={isPending || undefined}
      className={cn('flex-row items-center gap-5', className)}
    >
      {profile.data ? <LevelGauge profile={profile.data} /> : <GaugeSkeleton />}
      <span aria-hidden className="w-px self-stretch bg-divider-1" />
      {league.data ? (
        <Gauge
          label={<TierBadge leagueId={league.data.leagueId} leagueName={league.data.leagueName} />}
          name="리그 포인트"
          value={league.data.currentLP}
          max={league.data.maxLP}
          unit="LP"
        />
      ) : (
        <GaugeSkeleton />
      )}
    </Card>
  );
}

function LevelGauge({ profile }: { profile: UserProfile }) {
  return (
    <Gauge
      label={
        <span className="flex min-w-0 items-center gap-2 text-heading2 text-text-1">
          <ProfileAvatar colorNumber={profile.profileImageNumber} className="size-8" />
          <span className="truncate">{profile.nickname}</span>
          <span className="shrink-0">LV {profile.level}</span>
        </span>
      }
      name="경험치"
      value={profile.currentXp}
      max={profile.maxXp}
      unit="XP"
    />
  );
}

interface GaugeProps {
  label: ReactNode;
  /** 진행률 표시줄의 접근성 이름. */
  name: string;
  value: number;
  max: number;
  unit: string;
}

function Gauge({ label, name, value, max, unit }: GaugeProps) {
  // max가 0이면 비율이 NaN이 되며, clampPercent가 이를 0으로 정규화한다.
  const percent = clampPercent(Math.floor((value / max) * 100));

  return (
    <div data-slot="gauge" className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">{label}</div>
        <span className="shrink-0 whitespace-nowrap text-body1-normal text-text-4">
          <span className="text-main">{value}</span> / {max} {unit}
        </span>
      </div>
      <ProgressBar value={percent} aria-label={name} />
    </div>
  );
}

function GaugeSkeleton() {
  return (
    <div data-slot="gauge" className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Skeleton variant="circular" className="size-8" />
          <Skeleton className="w-18 text-heading2" />
        </span>
        <Skeleton className="w-16 text-body1-normal" />
      </div>
      <Skeleton variant="block" className="h-2 w-full rounded-full" />
    </div>
  );
}
