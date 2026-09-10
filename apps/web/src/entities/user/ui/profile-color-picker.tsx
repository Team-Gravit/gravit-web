import { cn } from '@/shared/lib/cn';

import { getNextProfileColorNumber, getPreviousProfileColorNumber } from '../model/profile-colors';

import { ProfileAvatar } from './profile-avatar';

import LeftArrowIcon from './assets/arrow-left.svg?react';
import RightArrowIcon from './assets/arrow-right.svg?react';

export interface ProfileColorPickerProps {
  /** 현재 선택된 색 번호 (1~19) */
  value: number;
  onChange: (colorNumber: number) => void;
  className?: string;
}

const STEP_BUTTON_CLASS = [
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full',
  'outline-none focus-visible:ring-3 focus-visible:ring-purple-200',
];

/** 좌우 화살표로 프로필 색상을 선택한다. */
export function ProfileColorPicker({ value, onChange, className }: ProfileColorPickerProps) {
  const handlePreviousClick = () => {
    onChange(getPreviousProfileColorNumber(value));
  };

  const handleNextClick = () => {
    onChange(getNextProfileColorNumber(value));
  };

  return (
    <div
      data-slot="profile-color-picker"
      className={cn('flex items-center justify-between md:justify-center gap-8', className)}
    >
      <button
        type="button"
        aria-label="이전 프로필 색"
        onClick={handlePreviousClick}
        className={cn(STEP_BUTTON_CLASS)}
      >
        <LeftArrowIcon className="h-16 text-gray-500 md:text-cta-text" />
      </button>

      <ProfileAvatar colorNumber={value} className="size-[150px] md:size-[178px]" />

      <button
        type="button"
        aria-label="다음 프로필 색"
        onClick={handleNextClick}
        className={cn(STEP_BUTTON_CLASS)}
      >
        <RightArrowIcon className="h-16 text-gray-500 md:text-cta-text" />
      </button>
    </div>
  );
}
