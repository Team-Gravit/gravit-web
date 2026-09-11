import type { FormEvent, ReactNode } from 'react';

import { NicknameField, ProfileColorPicker } from '@/entities/user';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import type { useOnboardingForm } from '../model/use-onboarding-form';

const SUBMIT_LABEL = '다음';

export interface OnboardingFormProps {
  /** 페이지가 소유하는 폼 상태와 동작. */
  form: ReturnType<typeof useOnboardingForm>;
  /** 제출 버튼 옆에 표시할 보조 조작. */
  secondaryAction?: ReactNode;
  className?: string;
}

/** 프로필 색상과 닉네임을 제출하는 폼. */
export function OnboardingForm({ form, secondaryAction, className }: OnboardingFormProps) {
  const {
    colorNumber,
    setColorNumber,
    nickname,
    setNickname,
    nicknameStatus,
    canSubmit,
    isSubmitting,
    submit,
  } = form;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-1 flex-col items-center w-full h-full md:h-fit', className)}
    >
      <div className="flex flex-1 flex-col justify-center gap-6 md:gap-2.5 w-full md:w-[325px] md:pt-13 short:md:pt-6">
        <ProfileColorPicker value={colorNumber} onChange={setColorNumber} />
        <NicknameField value={nickname} status={nicknameStatus} onChange={setNickname} />
      </div>

      <div className="flex gap-3 w-full py-5 md:py-0">
        {secondaryAction}
        <Button
          type="submit"
          size="cta"
          disabled={!canSubmit}
          isLoading={isSubmitting}
          className="flex-1"
        >
          {SUBMIT_LABEL}
        </Button>
      </div>
    </form>
  );
}
