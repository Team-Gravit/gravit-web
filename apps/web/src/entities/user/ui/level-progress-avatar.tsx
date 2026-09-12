import { useId } from 'react';

import { getLevelInfo } from '../model/level';
import { ProfileAvatar } from './profile-avatar';

export interface LevelProgressAvatarProps {
  xp: number;
  profileImgNumber: number;
  /** 아바타 지름(px). */
  size?: number;
  /**
   * 레벨 진행 링 표시 여부. 리그 랭킹 시안상 **데스크톱만** 링을 두르고 모바일은 링 없는 아바타다.
   * 링 디자인(트랙 없음·strokeWidth 4·꽉 찬 콘텐츠)은 별도 컴포넌트로 빼지 않고 여기서 그린다.
   */
  showRing?: boolean;
}

/** 유저 프로필 아바타. showRing이면 xp 기반 레벨 진행 링을 두른다. 색은 profileImgNumber로 정한다. */
export function LevelProgressAvatar({
  xp,
  profileImgNumber,
  size = 56,
  showRing = true,
}: LevelProgressAvatarProps) {
  const gradientId = useId();
  const { progress } = getLevelInfo(xp);

  const avatar = <ProfileAvatar colorNumber={profileImgNumber} className="size-full" />;

  if (!showRing) {
    return (
      <div style={{ width: size, height: size }} className="shrink-0 overflow-hidden rounded-full">
        {avatar}
      </div>
    );
  }

  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex shrink-0 items-center justify-center"
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">{avatar}</div>

      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ transform: 'rotate(90deg) scaleX(-1)' }}
        aria-hidden="true"
      >
        <defs>
          {/* 레벨 진행 링 브랜드 그라디언트. SVG stop 은 Tailwind 클래스로 표현할 수 없어 값으로 둔다. */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8100B3" />
            <stop offset="100%" stopColor="#DD00FF" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all"
        />
      </svg>
    </div>
  );
}
