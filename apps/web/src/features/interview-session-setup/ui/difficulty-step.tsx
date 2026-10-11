import { INTERVIEW_DIFFICULTY_LABEL, type InterviewDifficulty } from '@/entities/interview';

import { useSessionSetupStore } from '../model/session-setup-store';
import type { ChoiceOption } from './choice-group';
import { ChoiceRadioList } from './choice-radio-list';

const DIFFICULTY_OPTIONS: ChoiceOption<InterviewDifficulty>[] = [
  {
    value: 'HARD',
    title: INTERVIEW_DIFFICULTY_LABEL.HARD,
    description: '심화 개념까지 깊이 있게 물어봐요',
  },
  {
    value: 'NORMAL',
    title: INTERVIEW_DIFFICULTY_LABEL.NORMAL,
    description: '기본과 심화 개념을 골고루 물어봐요',
  },
  {
    value: 'EASY',
    title: INTERVIEW_DIFFICULTY_LABEL.EASY,
    description: '기본 개념 위주로 편하게 연습해요',
  },
];

/**
 * CS 분야 또는 기술 스택 선택을 마친 뒤, 질문의 난이도를 고르는 단계.
 * 두 면접 유형에서 공유하는 선택이며, 여기서 고른 값은 최종 확인과 세션 생성 요청에 사용한다.
 */
export function DifficultyStep() {
  const selectedDifficulty = useSessionSetupStore((state) => state.difficulty);
  const selectDifficulty = useSessionSetupStore((state) => state.selectDifficulty);

  return (
    <ChoiceRadioList
      label="난이도"
      name="interview-difficulty"
      options={DIFFICULTY_OPTIONS}
      selectedValue={selectedDifficulty}
      onSelect={selectDifficulty}
    />
  );
}
