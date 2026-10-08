/** 제출 결과 문구 */
export const CORRECT_ANSWER_MESSAGE = '👏🏻 정답입니다!';
export const INCORRECT_ANSWER_MESSAGE = '❌ 오답입니다!';

/**
 * 주관식 오답에서 보여줄 정답 (FEAT-038 D11)
 *
 * - 인정되는 답을 **모두 열거**
 */
export function toIncorrectSubjectiveMessage(correctAnswers: string[]): string {
  if (correctAnswers.length === 0) {
    return INCORRECT_ANSWER_MESSAGE;
  }

  return `❌ 정답: ${correctAnswers.join(', ')}`;
}

/**
 * 제출 후 선지에 붙는 표시 상태
 */
export const OPTION_RESULTS = {
  correct: 'correct',
  incorrect: 'incorrect',
  neutral: 'neutral',
} as const;

export type OptionResult = (typeof OPTION_RESULTS)[keyof typeof OPTION_RESULTS];
