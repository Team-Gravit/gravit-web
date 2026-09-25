// 문제 카드의 입력 폼과 하단 제출 버튼을 연결해 입력 중인 값을 세션 상태로 올리지 않는다.
export const QUIZ_ANSWER_FORM_ID = 'quiz-answer-form';

export const PROBLEM_NAV_LABELS = {
  wide: { prev: '이전 문제', next: '다음 문제' },
  narrow: { prev: '이전', next: '다음' },
} as const;

export const QUIZ_SUBMIT_LABEL = '제출하기';

export const PROGRESS_PANEL_LABELS = {
  progress: '진행률',
  title: '문제 풀이',
  current: '현재 문제',
  completed: '완료',
  incomplete: '미완료',
} as const;
