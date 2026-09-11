import { useId } from 'react';

import { cn } from '@/shared/lib/cn';

import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, NICKNAME_PATTERN } from '../model/nickname';

const LABEL = '닉네임 설정';
const PLACEHOLDER = '닉네임을 입력해주세요.';
const VALID_MESSAGE = '사용 가능한 닉네임이에요.';
const INVALID_MESSAGE = '사용할 수 없는 닉네임이에요.';
const HELPER_MESSAGES = [
  `*글자수 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자`,
  '*공백, 특수문자 제외',
];

/** 닉네임 검증 결과에 따른 표시 상태. */
export type NicknameFieldStatus = 'default' | 'checking' | 'valid' | 'invalid';

export interface NicknameFieldProps {
  value: string;
  status: NicknameFieldStatus;
  onChange: (value: string) => void;
  className?: string;
}

/** 닉네임 입력과 검증 상태를 표시한다. */
export function NicknameField({ value, status, onChange, className }: NicknameFieldProps) {
  const inputId = useId();
  const messageId = useId();

  return (
    <div
      data-slot="nickname-field"
      className={cn('relative mb-[78px] flex w-full flex-col gap-2', className)}
    >
      <label
        htmlFor={inputId}
        className="text-headline2 text-text-1 md:text-headline1 md:text-text-1-w"
      >
        {LABEL}
      </label>

      <input
        id={inputId}
        name="nickname"
        type="text"
        data-status={status}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={PLACEHOLDER}
        required
        minLength={NICKNAME_MIN_LENGTH}
        maxLength={NICKNAME_MAX_LENGTH}
        pattern={NICKNAME_PATTERN.source}
        aria-invalid={status === 'invalid' || undefined}
        aria-describedby={messageId}
        className={cn(
          'h-[54px] rounded-8 border border-divider-1 p-4 outline-none transition-colors w-full',
          'text-label1 text-text-1 placeholder:text-text-4',
          'md:h-[50px] md:border-2 bg-white md:text-body1-normal',
          'data-[status=valid]:border-semantic-success data-[status=invalid]:border-semantic-error',
          'focus-visible:ring-3 focus-visible:ring-purple-200 focus-visible:ring-offset-2',
        )}
      />

      {/* 안내 문구는 입력창 아래 8px에 배치하고, 상태와 무관하게 아래 공간 78px을 확보한다. */}
      <div id={messageId} className="absolute inset-x-0 top-full mt-2 text-caption1 md:text-label1">
        {status === 'valid' && <p className="text-semantic-success">{VALID_MESSAGE}</p>}
        {status === 'invalid' && <p className="text-semantic-error">{INVALID_MESSAGE}</p>}
        {status === 'default' && (
          <div className="space-y-1 text-text-4 md:text-text-1-w">
            {HELPER_MESSAGES.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
