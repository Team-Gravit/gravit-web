import { Button } from '@/shared/ui/button';

export const ONBOARDING_CANCEL_LABEL = '이전';

export interface OnboardingCancelButtonProps {
  onCancel: () => void;
}

/** 제출 버튼 옆에서 온보딩을 취소한다. */
export function OnboardingCancelButton({ onCancel }: OnboardingCancelButtonProps) {
  return (
    <Button
      type="button"
      variant="stroke-default"
      size="cta"
      className="shrink-0 w-[26%]"
      onClick={onCancel}
    >
      {ONBOARDING_CANCEL_LABEL}
    </Button>
  );
}
