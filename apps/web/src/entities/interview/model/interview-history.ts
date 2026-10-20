import type {
  GetSessionHistorySort,
  InterviewSessionHistoryResponse,
} from '@/shared/api/generated/model';

export type InterviewHistorySort = GetSessionHistorySort;

export const INTERVIEW_HISTORY_SORT_LABEL: Record<InterviewHistorySort, string> = {
  LATEST: '최신 순',
  OLDEST: '오래된 순',
};

export const INTERVIEW_HISTORY_EMPTY_MESSAGE =
  '아직 응시한 세션이 없어요.\n첫 세션을 시작해볼까요?';

/** 웹 목록 「2026년 7월 28일」 · 모바일 「2026. 07. 28」 · 웹 리포트 제목 아래 「2026.07.28」 */
export type SessionDateFormat = 'long' | 'dotted' | 'compact';

/** 날짜는 서버가 보낸 날짜 부분을 그대로 쓴다. 기기 시간대로 바꾸면 자정 근처 세션의 날짜가 달라진다. */
export function formatSessionDate(startedAt: string, format: SessionDateFormat): string {
  const [year, month, day] = startedAt.split('T')[0].split('-');

  if (format === 'dotted') {
    return `${year}. ${month}. ${day}`;
  }
  if (format === 'compact') {
    return `${year}.${month}.${day}`;
  }
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function formatSessionHistoryDetail(
  session: Pick<InterviewSessionHistoryResponse, 'topics' | 'startedAt'>,
  dateFormat: SessionDateFormat,
): string {
  return [
    ...session.topics.map((topic) => topic.displayName),
    formatSessionDate(session.startedAt, dateFormat),
  ].join(' · ');
}
