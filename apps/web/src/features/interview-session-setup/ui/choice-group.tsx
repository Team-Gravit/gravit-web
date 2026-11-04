import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface ChoiceOption<TValue extends string> {
  value: TValue;
  title: string;
  description?: string;
}

export interface ChoiceGroupProps<TValue extends string, TOption extends ChoiceOption<TValue>> {
  /** 보이는 단계 제목과 별개로 읽히는 선택 묶음의 이름. */
  label: string;
  /** 같은 값이면 하나의 라디오 묶음이 된다. 다른 묶음과 겹치지 않게 지정한다. */
  name: string;
  options: readonly TOption[];
  selectedValue: TValue | null;
  /** 재클릭도 전달한다. 같은 값을 받으면 선택을 해제하는 store 액션을 연결한다. */
  onSelect: (value: TValue) => void;
  /** 단계별 배치(가로·세로·격자)를 지정한다. */
  className?: string;
}

interface ChoiceFieldsetProps {
  label: string;
  className?: string;
  children: ReactNode;
}

/** 카드형·목록형 선택 UI가 공유하는 묶음. legend는 화면에서 숨기고 스크린 리더에만 읽힌다. */
export function ChoiceFieldset({ label, className, children }: ChoiceFieldsetProps) {
  return (
    <fieldset className={cn('flex min-w-0 flex-col gap-3', className)}>
      <legend className="sr-only">{label}</legend>
      {children}
    </fieldset>
  );
}

interface ChoiceRadioProps {
  name: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * 카드 안에 넣는 기본 라디오. label로 감싸면 카드 전체를 클릭할 수 있다.
 * 방향키 선택은 브라우저에 맡긴다. 이미 선택한 값은 change가 발생하지 않아 click으로 해제를 전달한다.
 */
export function ChoiceRadio({ name, value, isSelected, onSelect }: ChoiceRadioProps) {
  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={isSelected}
      onChange={onSelect}
      onClick={() => isSelected && onSelect()}
      className="sr-only"
    />
  );
}
