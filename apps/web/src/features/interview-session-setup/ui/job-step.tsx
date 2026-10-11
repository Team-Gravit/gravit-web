import { INTERVIEW_STACK_GROUP_LABEL, type InterviewStackGroup } from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import { ChoiceGroup, type ChoiceOption } from './choice-group';

const STACK_GROUP_OPTIONS: ChoiceOption<InterviewStackGroup>[] = [
  { value: 'SERVER', title: INTERVIEW_STACK_GROUP_LABEL.SERVER, description: 'Spring · Java 등' },
  { value: 'WEB', title: INTERVIEW_STACK_GROUP_LABEL.WEB, description: 'React · TypeScript 등' },
  { value: 'AOS', title: INTERVIEW_STACK_GROUP_LABEL.AOS, description: 'Jetpack · Kotlin' },
  { value: 'IOS', title: INTERVIEW_STACK_GROUP_LABEL.IOS, description: 'SwiftUI · Swift' },
];

/**
 * 직군별 특화 면접에서 연습할 직군(stackGroup)을 고른다.
 * 다음 단계는 이 직군의 스택 목록을 조회한다. 직군을 선택·해제하면 이전 스택 선택은 비워진다.
 */
export function JobStep() {
  const selectedStackGroup = useSessionSetupStore((state) => state.stackGroup);
  const selectStackGroup = useSessionSetupStore((state) => state.selectStackGroup);

  return (
    <ChoiceGroup
      label="직군"
      name="interview-stack-group"
      options={STACK_GROUP_OPTIONS}
      selectedValue={selectedStackGroup}
      onSelect={selectStackGroup}
    />
  );
}
