import { INTERVIEW_MODE_LABEL, type InterviewMode } from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import csIcon from './assets/cs-icon.png';
import jobIcon from './assets/job-icon.png';
import { ChoiceCardGroup, type ChoiceCardOption } from './choice-card-group';

const MODE_OPTIONS: ChoiceCardOption<InterviewMode>[] = [
  {
    value: 'COMMON_CS',
    title: INTERVIEW_MODE_LABEL.COMMON_CS,
    iconSrcs: [csIcon],
    description: '자료구조, 알고리즘 등 CS 5개 분야 중 원하는 주제를 골라 연습해요',
  },
  {
    value: 'JOB_SPECIFIC',
    title: INTERVIEW_MODE_LABEL.JOB_SPECIFIC,
    iconSrcs: [jobIcon],
    description: '지원하는 직군에 맞춰 프레임워크·언어까지 깊이 있게 물어봐요',
  },
];

/**
 * 「면접 주제」 단계에서 CS 개념·직군별 특화 중 면접 유형(mode)을 고른다.
 * CS 분야(topics)는 다음 단계에서 선택한다. 유형을 선택·해제하면 기존 분야·직군·스택은 비워진다.
 */
export function TopicStep() {
  const selectedMode = useSessionSetupStore((state) => state.mode);
  const selectMode = useSessionSetupStore((state) => state.selectMode);

  return (
    <ChoiceCardGroup
      label="면접 주제"
      name="interview-mode"
      options={MODE_OPTIONS}
      selectedValue={selectedMode}
      onSelect={selectMode}
      className="md:flex-row md:gap-6 md:*:flex-1"
    />
  );
}
