import type { InterviewAnswerDetailResponse } from '@/shared/api/generated/model';

export type ReportTab = 'summary' | 'answers';

export const REPORT_TAB_LABEL: Record<ReportTab, string> = {
  summary: '세션 종합',
  answers: '문항별 상세',
};

export type AverageComparison = 'higher' | 'lower' | 'same';

export function compareWithAverage(
  score: number,
  average: number,
): { comparison: AverageComparison; message: string } {
  const difference = Math.abs(score - average);

  if (score > average) {
    return { comparison: 'higher', message: `평균보다 ${difference}점 높아요` };
  }
  if (score < average) {
    return { comparison: 'lower', message: `평균보다 ${difference}점 낮아요` };
  }
  return { comparison: 'same', message: '평균과 같아요' };
}

const SCORE_SEGMENT_COUNT = 3;

export interface ScoreSegment {
  /** 이 칸이 끝나는 점수. 시안 기준 만점 14는 5 · 10 · 14, 만점 3은 1 · 2 · 3이다. */
  threshold: number;
  /** 0~1. 이 칸을 채운 비율. */
  fillRatio: number;
}

/** 항목별 점수 막대를 세 칸으로 나눈다. 앞 칸부터 차례로 채운다. */
export function getScoreSegments(score: number, maxScore: number): ScoreSegment[] {
  const thresholds = Array.from({ length: SCORE_SEGMENT_COUNT }, (_, index) =>
    Math.ceil((maxScore * (index + 1)) / SCORE_SEGMENT_COUNT),
  );

  return thresholds.map((threshold, index) => {
    const start = index === 0 ? 0 : thresholds[index - 1];
    const span = threshold - start;
    const fillRatio = span > 0 ? Math.min(Math.max((score - start) / span, 0), 1) : 0;
    return { threshold, fillRatio };
  });
}

export function formatAnswerTitle(
  answer: Pick<InterviewAnswerDetailResponse, 'displayOrder' | 'topic'>,
): string {
  return `${answer.displayOrder}. ${answer.topic.displayName}`;
}
