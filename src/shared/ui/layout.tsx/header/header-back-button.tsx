import { useNavigate, useRouter } from '@tanstack/react-router';

import LeftArrow from '@/shared/assets/icons/buttons/left-arrow.svg?react';
import { cn } from '@/shared/lib/cn';

interface HeaderBackButtonProps {
  backPath?: string;
  fallbackTo?: string;
  className?: string;
}

export default function HeaderBackButton({
  backPath,
  fallbackTo = '/main',
  className,
}: HeaderBackButtonProps) {
  const router = useRouter();
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate({ to: backPath });
      return;
    }

    if (window.history.length > 1) {
      router.history.back();
      return;
    }

    navigate({
      to: fallbackTo,
    });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn('cursor-pointer flex items-center justify-center size-12', className)}
    >
      <LeftArrow className="size-6" />
    </button>
  );
}
