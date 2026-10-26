export { useCsTopics } from './api/use-cs-topics';
export { useInterviewStacks, usePrefetchInterviewStacks } from './api/use-interview-stacks';
export {
  useInterviewDashboard,
  useInterviewSessionAnswers,
  useInterviewSessionHistory,
  useInterviewSessionSummary,
  useInterviewWeakTopics,
} from './api';
export {
  INTERVIEW_HISTORY_MODE_LABEL,
  formatSessionSummary,
  getAccuracyLevel,
  getRecentAverageScore,
  type AccuracyLevel,
} from './model/interview-dashboard';
export {
  INTERVIEW_HISTORY_EMPTY_MESSAGE,
  INTERVIEW_HISTORY_SORT_LABEL,
  formatSessionDate,
  formatSessionHistoryDetail,
  type InterviewHistorySort,
  type SessionDateFormat,
} from './model/interview-history';
export {
  REPORT_TAB_LABEL,
  compareWithAverage,
  formatAnswerTitle,
  getScoreSegments,
  type AverageComparison,
  type ReportTab,
  type ScoreSegment,
} from './model/interview-report';
export {
  INTERVIEW_DIFFICULTY_LABEL,
  INTERVIEW_INPUT_TYPE_LABEL,
  INTERVIEW_MODE_LABEL,
  INTERVIEW_STACK_GROUP_LABEL,
  type InterviewDifficulty,
  type InterviewInputType,
  type InterviewMode,
  type InterviewStack,
  type InterviewStackGroup,
  type InterviewTopic,
} from './model/interview-options';

export type {
  InterviewAnswerDetailResponse,
  InterviewDashboardResponse,
  InterviewScoreTrendResponse,
  InterviewSessionCreateRequest,
  InterviewSessionHistoryResponse,
  InterviewSessionSummaryResponse,
  InterviewStackResponse,
  InterviewTopicAccuracyResponse,
  InterviewTopicResponse,
} from '@/shared/api/generated/model';
