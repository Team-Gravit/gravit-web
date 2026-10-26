import { cva } from 'class-variance-authority';

import {
  ChoiceFieldset,
  ChoiceRadio,
  type ChoiceGroupProps,
  type ChoiceOption,
} from './choice-group';

export interface ChoiceCardOption<TValue extends string> extends ChoiceOption<TValue> {
  /**
   * 언어·프레임워크처럼 함께 표시할 아이콘을 순서대로 넘긴다.
   * 제목에 같은 이름이 있어 이미지 대체 텍스트는 비운다.
   */
  iconSrcs?: readonly string[];
}

export interface ChoiceCardGroupProps<TValue extends string>
  extends ChoiceGroupProps<TValue, ChoiceCardOption<TValue>> {
  /**
   * 데스크톱 카드 배치. 모바일은 모두 아이콘이 제목 왼쪽에 붙는 가로형이다.
   * - stacked: 아이콘이 제목 위에 오는 큰 카드 (답변 방식·면접 유형)
   * - inline: 아이콘이 제목 왼쪽에 붙는 카드 (직군)
   * - tile: 높이를 내용에 맞추는 세로형 카드. 안쪽 여백은 개수에 따라 호출부가 정한다 (스택)
   */
  layout?: 'stacked' | 'inline' | 'tile';
}

const choiceCardVariants = cva(
  [
    'flex cursor-pointer gap-3 rounded-12 bg-bg-0 p-4',
    // 선택된 카드는 테두리로 구분하고, 마우스를 올리면 배경을 강조한다.
    'border border-transparent',
    'hover:bg-purple-50',
    'has-[:checked]:border-main has-[:checked]:bg-bg-0 has-[:checked]:hover:bg-purple-50',
    'has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-purple-200',
  ],
  {
    variants: {
      layout: {
        // WEB-AI-01 시안(node 14460:25168 · 14460:25559).
        // 시안의 elevation/0 그림자는 공통 토큰에 없어 넣지 않는다 (design-source-policy §6).
        // 낮은 화면에서는 최소 높이를 200px까지 줄인다. 내용이 더 길면 카드도 함께 늘어난다.
        stacked:
          'items-center md:min-h-[clamp(--spacing(50),30vh,--spacing(80))] md:flex-col md:items-start md:gap-6 md:p-12',
        // WEB-AI-04 시안(node 14370:39312 · 14370:38930). 아이콘이 제목 왼쪽 위에 붙는다.
        inline: 'items-start md:gap-6 md:p-12',
        // WEB-AI-05 시안(node 14923:21233). 스택 수에 따라 열과 여백이 바뀌어 md 여백은 두지 않는다.
        tile: 'items-center md:flex-col md:items-start md:gap-6',
      },
    },
    defaultVariants: { layout: 'stacked' },
  },
);

const choiceTextVariants = cva('flex min-w-0 flex-1 flex-col gap-2 md:gap-4', {
  variants: {
    // 세로형 카드에서는 글 묶음이 남는 높이를 차지하지 않고 아이콘 바로 아래에 붙는다.
    layout: { stacked: 'md:flex-none', inline: '', tile: 'md:flex-none' },
  },
});

/** 아이콘·제목·설명을 담은 카드 중 하나를 고르는 단일 선택 묶음. */
export function ChoiceCardGroup<TValue extends string>({
  label,
  name,
  options,
  selectedValue,
  onSelect,
  className,
  layout = 'stacked',
}: ChoiceCardGroupProps<TValue>) {
  return (
    <ChoiceFieldset label={label} className={className}>
      {options.map(({ value, title, description, iconSrcs }) => (
        <label key={value} className={choiceCardVariants({ layout })}>
          <ChoiceRadio
            name={name}
            value={value}
            isSelected={selectedValue === value}
            onSelect={() => onSelect(value)}
          />
          {iconSrcs && iconSrcs.length > 0 && (
            // 여러 아이콘 사이 간격은 시안이 정해지면 교체한다.
            <span className="flex shrink-0 items-center gap-2">
              {iconSrcs.map((iconSrc) => (
                <img key={iconSrc} src={iconSrc} alt="" className="size-8 md:size-15" />
              ))}
            </span>
          )}
          <span className={choiceTextVariants({ layout })}>
            <span className="text-headline2 text-text-1 md:text-heading1">{title}</span>
            {description && (
              <span className="text-label1 text-text-3-w md:text-heading1">{description}</span>
            )}
          </span>
        </label>
      ))}
    </ChoiceFieldset>
  );
}
