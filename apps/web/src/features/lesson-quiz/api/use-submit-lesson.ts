import { useQueryClient } from '@tanstack/react-query';

import {
  getGetLessonResultQueryOptions,
  useSaveLessonSubmission,
} from '@/shared/api/generated/lesson-api/lesson-api';
import type { LessonSubmissionSaveResponse } from '@/shared/api/generated/model';

import { toSubmissionBody, type SubmissionInput } from '../model/submission';

export interface UseSubmitLessonOptions {
  onSuccess: (response: LessonSubmissionSaveResponse) => void | Promise<void>;
  onError?: () => void;
}

/**
 * 레슨 답안을 제출하고 결과 조회 캐시를 채운 뒤 `onSuccess`를 호출한다.
 * prefetch가 실패해도 제출 성공은 유지하며, 결과 화면에서 조회 오류를 처리한다.
 */
export function useSubmitLesson({ onSuccess, onError }: UseSubmitLessonOptions) {
  const queryClient = useQueryClient();
  const mutation = useSaveLessonSubmission({
    mutation: {
      onSuccess: async (response) => {
        // 생성된 옵션을 사용해야 동일한 queryKey와 queryFn으로 결과를 캐시한다.
        await queryClient.prefetchQuery(
          getGetLessonResultQueryOptions(response.lessonSubmissionId),
        );
        await onSuccess(response);
      },
      onError,
    },
  });

  return {
    ...mutation,
    submit: (input: SubmissionInput) => mutation.mutate({ data: toSubmissionBody(input) }),
  };
}
