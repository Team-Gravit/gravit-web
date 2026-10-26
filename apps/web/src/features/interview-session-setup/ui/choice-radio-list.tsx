import { cn } from '@/shared/lib/cn';

import {
  ChoiceFieldset,
  ChoiceRadio,
  type ChoiceGroupProps,
  type ChoiceOption,
} from './choice-group';

export type ChoiceRadioListProps<TValue extends string> = ChoiceGroupProps<
  TValue,
  ChoiceOption<TValue>
>;

/**
 * 난이도처럼 제목·설명 오른쪽에 라디오를 두는 목록. 카드 테두리 대신 라디오 점으로 선택을 표시한다.
 * WEB-AI-06 시안(node 14370:39469). Card에 적용된 동일한 elevation/0 값을 사용한다.
 */
export function ChoiceRadioList<TValue extends string>({
  label,
  name,
  options,
  selectedValue,
  onSelect,
  className,
}: ChoiceRadioListProps<TValue>) {
  return (
    <ChoiceFieldset label={label} className={cn('md:gap-6', className)}>
      {options.map(({ value, title, description }) => (
        <label
          key={value}
          className="group flex cursor-pointer items-center gap-3 rounded-12 bg-bg-0 p-4 shadow-[0px_4px_32px_0px_#00000006] has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-purple-200 md:gap-6 md:p-8"
        >
          <ChoiceRadio
            name={name}
            value={value}
            isSelected={selectedValue === value}
            onSelect={() => onSelect(value)}
          />
          <span className="flex min-w-0 flex-1 flex-col gap-2 md:gap-4">
            <span className="text-headline2 text-text-1 md:text-title2">{title}</span>
            {description && (
              <span className="text-label1 text-text-4 md:text-heading1">{description}</span>
            )}
          </span>
          <RadioMark />
        </label>
      ))}
    </ChoiceFieldset>
  );
}

// 테두리 두께가 소수 픽셀이라 CSS 박스로 그리면 배율에 따라 점이 치우쳐 보일 수 있다.
// 두 원을 같은 좌표에 그려 중심을 맞춘다.
function RadioMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0 overflow-visible md:size-6"
    >
      <circle
        cx="12"
        cy="12"
        r="11.2"
        vectorEffect="non-scaling-stroke"
        className="fill-bg-0 stroke-cta-secondary-text stroke-1 group-has-checked:stroke-main group-has-checked:stroke-[1.6px]"
      />
      <circle cx="12" cy="12" r="6" className="fill-transparent group-has-checked:fill-main" />
    </svg>
  );
}
