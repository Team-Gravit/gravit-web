import type { ReactNode } from 'react';

import useNicknameForm from '@/features/onboarding/model/use-nickname-form';
import { cn } from '@/shared/lib/cn';

interface NicknameFormProps {
  formId: string;
  initialNickname?: string;
  onSubmit: (nickname: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  helperText?: ReactNode;
  placeholder?: string;
}

export default function NicknameForm({
  formId,
  initialNickname,
  onSubmit,
  onValidityChange,
  helperText,
  placeholder = '닉네임을 입력해주세요.',
}: NicknameFormProps) {
  const { nickname, handleChange, isValid, checking, isDirty, handleSubmit } = useNicknameForm({
    initialNickname,
    onSubmit,
    onValidityChange,
  });

  const isEmpty = !nickname.trim();
  const showValidMessage = isDirty && !checking && isValid;
  const showInvalidMessage = isDirty && !checking && !isValid && !isEmpty;
  const showHelperText = (!isDirty || isEmpty) && helperText;

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col w-full gap-3 md:gap-2"
    >
      <label className={`font-semibold flex flex-col gap-2`}>
        <span className="text-headline2 text-text-1 md:text-text-1-w md:text-headline1">
          닉네임 설정
        </span>
        <input
          id="nickname"
          name="nickname"
          type="text"
          value={nickname}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          required
          minLength={2}
          maxLength={8}
          pattern="^[가-힣a-zA-Z0-9]+$"
          className={cn(
            'outline-none transition-colors p-4 md:bg-text-1-w rounded-lg h-[54px] md:h-[50px] border md:border-[2.5px] border-divider-1 text-label1 md:text-body1-normal text-text-1 placeholder:text-text-4',
            showValidMessage && 'border-semantic-success ',
            showInvalidMessage && 'border-semantic-error',
          )}
        />
      </label>

      {helperText && (
        <div className="min-h-8 md:min-h-[37px] text-caption1 md:text-label1">
          {showValidMessage && <p className="text-semantic-success">사용 가능한 닉네임이에요.</p>}

          {showInvalidMessage && (
            <p className="text-semantic-error">사용할 수 없는 닉네임이에요.</p>
          )}

          {showHelperText && <>{helperText}</>}
        </div>
      )}
    </form>
  );
}
