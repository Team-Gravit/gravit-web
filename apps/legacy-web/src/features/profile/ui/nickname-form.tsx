import useNicknameForm from '@/features/profile/model/use-nickname-form';
import { cn } from '@/shared/lib/cn';

interface NicknameFormProps {
  formId: string;
  initialNickname?: string;
  onSubmit: (nickname: string) => void;
  onValidityChange?: (isValid: boolean, isChanged: boolean) => void;
  placeholder?: string;
  isCompact?: boolean;
  labelClassName?: string;
  inputClassName?: string;
}

export default function NicknameForm({
  formId,
  initialNickname,
  onSubmit,
  onValidityChange,
  placeholder = '닉네임을 입력해주세요.',
  isCompact,
  labelClassName,
  inputClassName,
}: NicknameFormProps) {
  const { nickname, handleChange, isValid, checking, isDirty, isChanged, handleSubmit } =
    useNicknameForm({
      initialNickname,
      onSubmit,
      onValidityChange,
    });

  const isEmpty = !nickname.trim();
  const showValidMessage = isDirty && !checking && isValid && isChanged;
  const showInvalidMessage = isDirty && !checking && !isValid && !isEmpty && isChanged;
  const showDefaultHelper = !isDirty || isEmpty || !isChanged;

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn('flex flex-col w-full gap-3', !isCompact && 'md:gap-2')}
    >
      <label className="font-semibold flex flex-col gap-2">
        <span
          className={cn(
            'text-headline2 text-text-1',
            !isCompact && 'md:text-text-1-w md:text-headline1',
            labelClassName,
          )}
        >
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
            'outline-none transition-colors p-4 rounded-lg h-[54px] border border-divider-1 text-label1 text-text-1 placeholder:text-text-4',
            !isCompact && 'md:bg-text-1-w md:h-[50px] md:border-[2.5px] md:text-body1-normal',
            showValidMessage && 'border-semantic-success',
            showInvalidMessage && 'border-semantic-error',
            inputClassName,
          )}
        />
      </label>

      <div className={cn('min-h-8 text-caption1 md:min-h-[37px] md:text-label1')}>
        {showValidMessage && <p className="text-semantic-success">사용 가능한 닉네임이에요.</p>}
        {showInvalidMessage && <p className="text-semantic-error">사용할 수 없는 닉네임이에요.</p>}
        {showDefaultHelper && (
          <div className={cn('space-y-1 text-text-4', !isCompact && 'md:text-text-1-w')}>
            <p>*글자수 2~8자</p>
            <p>*공백, 특수문자 제외</p>
          </div>
        )}
      </div>
    </form>
  );
}
