import { useId, type ReactNode } from 'react';

import { ProfileAvatar, useUserProfile } from '@/entities/user';
import { TierIcon, useLeagueSummary } from '@/entities/league';
import { cn } from '@/shared/lib/cn';

export interface HeroProfileSummaryProps {
  className?: string;
}

/** 두 조회를 독립적으로 렌더링해 한쪽 실패가 다른 항목을 숨기지 않게 한다. */
export function HeroProfileSummary({ className }: HeroProfileSummaryProps) {
  const { data: profile } = useUserProfile();
  const { data: league } = useLeagueSummary();

  return (
    <div
      data-slot="hero-profile-summary"
      className={cn('flex items-center gap-4 text-label1 text-text-1-w', className)}
    >
      {profile ? (
        <div data-slot="hero-profile-level" className="flex items-center gap-2">
          <HeroProgressRing value={profile.currentXp} max={profile.maxXp}>
            <ProfileAvatar colorNumber={profile.profileImageNumber} className="size-6" />
          </HeroProgressRing>
          <span>LV {profile.level}</span>
        </div>
      ) : null}

      {league ? (
        <div data-slot="hero-profile-tier" className="flex items-center gap-2">
          <HeroProgressRing value={league.currentLP} min={league.minLP} max={league.maxLP}>
            <TierIcon tierId={league.leagueId} aria-hidden className="size-6" />
          </HeroProgressRing>
          <span>{league.leagueName}</span>
        </div>
      ) : null}
    </div>
  );
}

interface HeroProgressRingProps {
  value: number;
  min?: number;
  max: number;
  children: ReactNode;
}

function HeroProgressRing({ value, min = 0, max, children }: HeroProgressRingProps) {
  const gradientId = useId();
  const range = max - min;
  const progress = range > 0 ? Math.min(Math.max((value - min) / range, 0), 1) : 0;
  const size = 32;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <span
      data-slot="hero-progress-ring"
      className="relative flex size-8 shrink-0 items-center justify-center"
    >
      {children}

      <svg
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        style={{ transform: 'rotate(90deg) scaleX(-1)' }}
      >
        <defs>
          {/* SVG stroke는 CSS 배경 그라디언트를 사용할 수 없어 main/gr의 stop 색상을 직접 적용한다. */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8100B3" />
            <stop offset="100%" stopColor="#DD00FF" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </span>
  );
}
