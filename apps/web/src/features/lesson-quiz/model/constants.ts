export const PROBLEM_NAV_LABELS = {
  wide: { prev: '이전 문제', next: '다음 문제' },
  narrow: { prev: '이전', next: '다음' },
} as const;

export const QUIZ_SUBMIT_LABEL = '제출하기';

/** 결과 화면 없이 끝나는 복습 풀이의 마지막 버튼. */
export const QUIZ_FINISH_LABEL = '완료';

export const PROGRESS_PANEL_LABELS = {
  progress: '진행률',
  title: '문제 풀이',
  current: '현재 문제',
  completed: '완료',
  incomplete: '미완료',
} as const;
