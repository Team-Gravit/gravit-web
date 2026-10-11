import { INTERVIEW_INPUT_TYPE_LABEL, type InterviewInputType } from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import speakIcon from './assets/speak-icon.png';
import textIcon from './assets/text-icon.png';
import { ChoiceCardGroup, type ChoiceCardOption } from './choice-card-group';

const INPUT_TYPE_OPTIONS: ChoiceCardOption<InterviewInputType>[] = [
  {
    value: 'VOICE',
    title: INTERVIEW_INPUT_TYPE_LABEL.VOICE,
    iconSrcs: [speakIcon],
    description: '실제로 말하면서 답변을 연습해요.',
  },
  {
    value: 'TEXT',
    title: INTERVIEW_INPUT_TYPE_LABEL.TEXT,
    iconSrcs: [textIcon],
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
    <ChoiceCardGroup
      label="답변 방식"
      name="interview-input-type"
      options={INPUT_TYPE_OPTIONS}
      selectedValue={selectedInputType}
      onSelect={selectInputType}
      className="md:flex-row md:gap-6 md:*:flex-1"
    />
  );
}
