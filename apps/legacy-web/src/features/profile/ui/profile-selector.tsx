import LeftArrow from '@/shared/assets/icons/buttons/left-gray-arrow.svg?react';
import RightArrow from '@/shared/assets/icons/buttons/right-gray-arrow.svg?react';
import Profile from '@/shared/assets/icons/profile2.svg?react';
import { cn } from '@/shared/lib/cn';
import { PROFILE_COLORS } from '@/shared/lib/ProfileColor';

interface ProfileSelectorProps {
  colorIndex: number;
  onChange: (index: number) => void;
  className?: string;
  isCompact?: boolean;
}

export default function ProfileSelector({
  colorIndex,
  onChange,
  className,
  isCompact,
}: ProfileSelectorProps) {
  const colorKeys = Object.keys(PROFILE_COLORS).map(Number) as (keyof typeof PROFILE_COLORS)[];

  const handlePrev = () => {
    const newIndex = colorIndex === 0 ? colorKeys.length - 1 : colorIndex - 1;
    onChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = colorIndex === colorKeys.length - 1 ? 0 : colorIndex + 1;
    onChange(newIndex);
  };

  return (
    <div className={cn('flex flex-row items-center justify-center', className)}>
      <button type="button" onClick={handlePrev}>
        <LeftArrow
          className={cn('mt-0.5 cursor-pointer text-text-3-w', !isCompact && 'md:text-text-1-w')}
        />
      </button>

      <Profile
        className={cn('size-[150px]', !isCompact && 'md:size-[178px]')}
        style={{ color: PROFILE_COLORS[colorKeys[colorIndex]] }}
      />

      <button type="button" onClick={handleNext}>
        <RightArrow
          className={cn('cursor-pointer text-text-3-w', !isCompact && 'md:text-text-1-w')}
        />
      </button>
    </div>
  );
}
