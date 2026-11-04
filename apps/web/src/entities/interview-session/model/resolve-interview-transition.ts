import type { NavigateOptions } from '@tanstack/react-router';

import type { InterviewSessionStatusResponse } from '@/shared/api/generated/model';

import { GRADING_FAILED_MESSAGE, SESSION_ENDED_MESSAGE } from './constants';

type SessionStatus = InterviewSessionStatusResponse['status'];

export interface InterviewTransition {
  navigate: NavigateOptions;
  toast?: string;
}

export function resolveInterviewTransition(
  status: SessionStatus,
  sessionId: number,
): InterviewTransition | null {
  const id = String(sessionId);
  switch (status) {
    case 'GRADING':
      return {
        navigate: {
          to: '/interview/sessions/grading/$sessionId',
          params: {
            sessionId: id,
          },
          replace: true,
        },
      };

    case 'COMPLETED':
      return {
        navigate: {
          to: '/interview/history/$sessionId',
          params: {
            sessionId: id,
          },
          search: {
            tab: 'summary',
          },
          replace: true,
        },
      };

    case 'GRADING_FAILED':
      return { navigate: { to: '/interview', replace: true }, toast: GRADING_FAILED_MESSAGE };

    case 'ABANDONED':
      return { navigate: { to: '/interview', replace: true }, toast: SESSION_ENDED_MESSAGE };

    case 'IN_PROGRESS':
      return null;

    default:
      status satisfies never;
      return null;
  }
}
