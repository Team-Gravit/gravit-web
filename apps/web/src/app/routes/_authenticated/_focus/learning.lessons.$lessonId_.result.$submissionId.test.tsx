import { describe, expect, it } from 'vitest';
import { isNotFound, isRedirect } from '@tanstack/react-router';

import { Route } from './learning.lessons.$lessonId_.result.$submissionId';

type GuardResult = { lessonSubmissionId: number } | { redirectTo: string } | { notFound: true };

function runGuard(submissionId: string, state: { fromLessonSubmission?: boolean }): GuardResult {
  const guard = Route.options.beforeLoad as unknown as (opts: {
    params: { submissionId: string };
    location: { state: { fromLessonSubmission?: boolean } };
  }) => { lessonSubmissionId: number };

  try {
    return guard({ params: { submissionId }, location: { state } });
  } catch (error) {
    if (isRedirect(error)) {
      return { redirectTo: String(error.options.to) };
    }

    if (isNotFound(error)) {
      return { notFound: true };
    }

    throw error;
  }
}

describe('레슨 결과 진입 가드', () => {
  it('제출을 마치고 넘어오면 들여보낸다', () => {
    expect(runGuard('345', { fromLessonSubmission: true })).toEqual({ lessonSubmissionId: 345 });
  });

  it('통과권 없이 주소로 들어오면 학습 홈으로 넘긴다', () => {
    expect(runGuard('345', {})).toEqual({ redirectTo: '/learning' });
  });

  it('통과권이 있어도 제출 번호가 숫자가 아니면 404다', () => {
    expect(runGuard('abc', { fromLessonSubmission: true })).toEqual({ notFound: true });
  });
});
