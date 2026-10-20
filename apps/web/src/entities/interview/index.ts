export { useCsTopics } from './api/use-cs-topics';
export { useInterviewStacks, usePrefetchInterviewStacks } from './api/use-interview-stacks';
export { useInterviewDashboard, useInterviewWeakTopics } from './api';
export {
  INTERVIEW_HISTORY_MODE_LABEL,
  formatSessionSummary,
  getAccuracyLevel,
  getRecentAverageScore,
  type AccuracyLevel,
} from './model/interview-dashboard';
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
  InterviewDashboardResponse,
  InterviewScoreTrendResponse,
  InterviewSessionCreateRequest,
  InterviewSessionHistoryResponse,
  InterviewStackResponse,
  InterviewTopicAccuracyResponse,
  InterviewTopicResponse,
} from '@/shared/api/generated/model';
