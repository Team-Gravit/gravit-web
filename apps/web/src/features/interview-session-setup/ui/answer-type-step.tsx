import { INTERVIEW_INPUT_TYPE_LABEL, type InterviewInputType } from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import { ChoiceGroup, type ChoiceOption } from './choice-group';

const INPUT_TYPE_OPTIONS: ChoiceOption<InterviewInputType>[] = [
  {
    value: 'VOICE',
    title: INTERVIEW_INPUT_TYPE_LABEL.VOICE,
    description: '실제로 말하면서 답변을 연습해요.',
  },
  {
    value: 'TEXT',
    title: INTERVIEW_INPUT_TYPE_LABEL.TEXT,
    description: '직접 타이핑하면서 답변을 연습해요.',
  },
];

/**
 * 면접에서 답변을 입력할 방식(음성·텍스트)을 고르는 첫 단계.
 * 두 면접 유형에서 공통으로 사용하며, 같은 카드를 다시 누르면 선택이 해제된다.
 */
export function AnswerTypeStep() {
  const selectedInputType = useSessionSetupStore((state) => state.inputType);
  const selectInputType = useSessionSetupStore((state) => state.selectInputType);

  return (
    <ChoiceGroup
      label="답변 방식"
      name="interview-input-type"
      options={INPUT_TYPE_OPTIONS}
      selectedValue={selectedInputType}
      onSelect={selectInputType}
      className="md:flex-row md:gap-6 md:*:flex-1"
    />
  );
}
