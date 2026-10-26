import type {
  InterviewDashboardResponse,
  InterviewSessionHistoryResponse,
  InterviewSessionHistoryResponseMode,
} from '@/shared/api/generated/model';

/**
 * 최근 완료 세션의 평균 점수. 완료 세션이 없으면 `null`이다.
 * 서버는 완료 세션이 없을 때도 0을 보내므로, 실제 0점과 구분하려면 세션 수를 함께 본다.
 */
export function getRecentAverageScore(
  dashboard: Pick<InterviewDashboardResponse, 'completedSessionCount' | 'recentAverageScore'>,
): number | null {
  if (dashboard.completedSessionCount === 0) {
    return null;
  }

  return dashboard.recentAverageScore;
}

export type AccuracyLevel = 'low' | 'medium' | 'high';

// 시안은 30% · 60% · 80%를 각각 낮음 · 보통 · 높음으로 보여준다. 경계값은 시안에 없어 FEAT-062 spec에 기록했다.
const MEDIUM_ACCURACY_MIN = 50;
const HIGH_ACCURACY_MIN = 80;

export function getAccuracyLevel(accuracyRate: number): AccuracyLevel {
  if (accuracyRate >= HIGH_ACCURACY_MIN) {
    return 'high';
  }
  if (accuracyRate >= MEDIUM_ACCURACY_MIN) {
    return 'medium';
  }
  return 'low';
}

export const INTERVIEW_HISTORY_MODE_LABEL: Record<InterviewSessionHistoryResponseMode, string> = {
  COMMON_CS: 'CS모드',
  JOB_SPECIFIC: '직군모드',
};

/**
 * 응시 이력 한 줄 요약. 「자료구조 외 2개 · 7월 28일」
 * 주제가 하나면 「외 n개」를 붙이지 않는다. 날짜는 서버가 보낸 날짜 부분을 그대로 쓴다.
 */
export function formatSessionSummary(
  session: Pick<InterviewSessionHistoryResponse, 'topics' | 'startedAt'>,
): string {
  const [firstTopic, ...restTopics] = session.topics;
  const topicLabel =
    restTopics.length > 0
      ? `${firstTopic.displayName} 외 ${restTopics.length}개`
      : (firstTopic?.displayName ?? '');

  const [, month, day] = session.startedAt.split('T')[0].split('-');
  const dateLabel = `${Number(month)}월 ${Number(day)}일`;

  return topicLabel ? `${topicLabel} · ${dateLabel}` : dateLabel;
}
