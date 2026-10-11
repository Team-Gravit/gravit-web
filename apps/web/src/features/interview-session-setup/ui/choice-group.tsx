import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface ChoiceOption<TValue extends string> {
  value: TValue;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface ChoiceGroupProps<TValue extends string> {
  /** 화면의 단계 제목과 별도로, 스크린 리더에 선택 묶음의 이름을 알려준다. */
  label: string;
  /** 같은 묶음의 라디오를 연결하는 이름. 다른 선택 묶음과 겹치지 않게 지정한다. */
  name: string;
  options: readonly ChoiceOption<TValue>[];
  selectedValue: TValue | null;
  /** 선택과 재클릭 모두 해당 값을 전달한다. 호출부에서 같은 값은 해제하는 액션을 연결한다. */
  onSelect: (value: TValue) => void;
  /** 단계별 카드 배치(가로·세로·격자)를 지정한다. */
  className?: string;
}

// WEB-AI-01 시안(node 14460:25168 · 14460:25559). 모바일은 가로형 카드, md 이상은 세로형 큰 카드다.
// 시안의 elevation/0 그림자는 공통 토큰에 없어 넣지 않는다 (design-source-policy §6).
const CHOICE_CARD_CLASSES = [
  // 레이아웃
  'flex cursor-pointer items-center gap-3 rounded-12 bg-bg-0 p-4',
  // 카드 높이는 화면 높이에 따라 200~320px(시안 320px). 낮은 화면에서 하단 버튼이 밀려나지 않게 한다.
  'md:h-[clamp(--spacing(50),30vh,--spacing(80))] md:flex-col md:items-start md:gap-6 md:p-12',
  // 선택된 카드는 테두리로 구분하고, 마우스를 올리면 배경을 강조한다.
  'border border-transparent opacity-80',
  'hover:bg-purple-50',
  'has-[:checked]:border-main has-[:checked]:bg-bg-0 has-[:checked]:hover:bg-purple-50',
  // 키보드 포커스
  'has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-purple-200',
];

/**
 * 답변 방식·면접 유형·직군·스택·난이도에서 공통으로 쓰는 단일 선택 카드 묶음.
 * 선택 상태는 selectedValue로 받고, 변경할 값은 onSelect로 전달한다.
 * 방향키 이동은 기본 라디오 동작을 사용한다. 선택된 항목을 다시 누르면 change가 발생하지 않아
 * 재클릭은 onClick에서 따로 전달하고, 선택 해제는 호출부의 액션에 맡긴다.
 */
export function ChoiceGroup<TValue extends string>({
  label,
  name,
  options,
  selectedValue,
  onSelect,
  className,
}: ChoiceGroupProps<TValue>) {
  return (
    <fieldset className={cn('flex min-w-0 flex-col gap-3', className)}>
      <legend className="sr-only">{label}</legend>
      {options.map(({ value, title, description, icon }) => {
        const isSelected = selectedValue === value;

        return (
          <label key={value} className={cn(CHOICE_CARD_CLASSES)}>
            <input
              type="radio"
              name={name}
              value={value}
              checked={isSelected}
              onChange={() => onSelect(value)}
              onClick={() => isSelected && onSelect(value)}
              className="sr-only"
            />
            {icon}
            <span className="flex min-w-0 flex-1 flex-col gap-2 md:flex-none md:gap-4">
              <span className="text-headline2 text-text-1 md:text-heading1">{title}</span>
              {description && (
                <span className="text-label1 text-text-3-w md:text-heading1">{description}</span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
