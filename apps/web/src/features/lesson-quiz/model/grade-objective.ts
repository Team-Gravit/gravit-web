import type { OptionResponse } from '@/shared/api/generated/model';

/**
 * 고른 선지가 정답인지 판정한다.
 *
 * 서버가 채점하지 않고 문제 목록 응답의 `isAnswer`를 그대로 주므로 판정이 클라이언트에 있다.
 */
export function gradeObjective(options: OptionResponse[], selectedOptionId: number): boolean {
  return options.some((option) => option.optionId === selectedOptionId && option.isAnswer);
}
