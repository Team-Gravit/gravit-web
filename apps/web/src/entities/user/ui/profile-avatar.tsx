import { cn } from '@/shared/lib/cn';

import { getProfileColor } from '../model/profile-colors';

import ProfileAvatarShape from './assets/profile-avatar.svg?react';

export interface ProfileAvatarProps {
  /** 현재 선택된 색 번호 (1~19) */
  colorNumber: number;
  className?: string;
}

/** 선택한 색상의 프로필 아바타를 표시한다. */
export function ProfileAvatar({ colorNumber, className }: ProfileAvatarProps) {
  return (
    <ProfileAvatarShape
      data-slot="profile-avatar"
      aria-hidden
      style={{ color: getProfileColor(colorNumber) }}
      className={cn('shrink-0', className)}
    />
  );
}
