import {
  INTERVIEW_STACK_GROUP_LABEL,
  usePrefetchInterviewStacks,
  type InterviewStackGroup,
} from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import androidIcon from './assets/android-icon.png';
import iosIcon from './assets/ios-icon.png';
import serverIcon from './assets/server-icon.png';
import webIcon from './assets/web-icon.png';
import { ChoiceCardGroup, type ChoiceCardOption } from './choice-card-group';

const STACK_GROUP_OPTIONS: ChoiceCardOption<InterviewStackGroup>[] = [
  {
    value: 'SERVER',
    title: INTERVIEW_STACK_GROUP_LABEL.SERVER,
    description: 'Spring · Java 등',
    iconSrcs: [serverIcon],
  },
  {
    value: 'WEB',
    title: INTERVIEW_STACK_GROUP_LABEL.WEB,
    description: 'React · TypeScript 등',
    iconSrcs: [webIcon],
  },
  {
    value: 'AOS',
    title: INTERVIEW_STACK_GROUP_LABEL.AOS,
    description: 'Jetpack · Kotlin',
    iconSrcs: [androidIcon],
  },
  {
    value: 'IOS',
    title: INTERVIEW_STACK_GROUP_LABEL.IOS,
    description: 'SwiftUI · Swift',
    iconSrcs: [iosIcon],
  },
];

/**
 * 직군별 특화 면접에서 연습할 직군(stackGroup)을 고른다.
 * 다음 단계는 이 직군의 스택 목록을 조회한다. 직군을 선택·해제하면 이전 스택 선택은 비워진다.
 */
export function JobStep() {
  const selectedStackGroup = useSessionSetupStore((state) => state.stackGroup);
  const selectStackGroup = useSessionSetupStore((state) => state.selectStackGroup);
  const prefetchStacks = usePrefetchInterviewStacks();

  // 직군을 누르는 시점에 조회를 시작해 다음 화면의 대기 시간을 줄인다.
  function handleStackGroupSelect(stackGroup: InterviewStackGroup) {
    prefetchStacks(stackGroup);
    selectStackGroup(stackGroup);
  }

  return (
    <ChoiceCardGroup
      label="직군"
      name="interview-stack-group"
      options={STACK_GROUP_OPTIONS}
      selectedValue={selectedStackGroup}
      onSelect={handleStackGroupSelect}
      layout="inline"
      className="md:grid md:grid-cols-2 md:gap-6"
    />
  );
}
