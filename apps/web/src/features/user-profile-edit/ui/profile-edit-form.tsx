import type { FormEvent } from 'react';

import { NicknameField, ProfileColorPicker } from '@/entities/user';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

import type { useProfileEditForm } from '../model/use-profile-edit-form';

const CANCEL_LABEL = '돌아가기';
const SUBMIT_LABEL = '수정하기';

export interface ProfileEditFormProps {
  /** 화면(모달/페이지)이 소유하는 폼 상태와 동작. */
  form: ReturnType<typeof useProfileEditForm>;
  /** 「돌아가기」를 눌렀을 때. 모달은 닫고, 페이지는 뒤로 이동한다. */
  onCancel: () => void;
  className?: string;
}

/** 프로필 색상·닉네임을 수정하는 폼. 색 피커 + 닉네임 필드 + 돌아가기/수정하기. */
export function ProfileEditForm({ form, onCancel, className }: ProfileEditFormProps) {
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
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-8 md:gap-10', className)}>
      <div className="flex flex-1 flex-col justify-center gap-6 md:gap-8">
        {/* 밝은 배경(모달·페이지)이므로 기본 surface="light". */}
        <ProfileColorPicker value={colorNumber} onChange={setColorNumber} />
        <NicknameField value={nickname} status={nicknameStatus} onChange={setNickname} />
      </div>

      <div className="flex gap-3 md:gap-4">
        <Button
          type="button"
          variant="stroke-neutral"
          size="cta"
          onClick={onCancel}
          className="flex-1"
        >
          {CANCEL_LABEL}
        </Button>
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
