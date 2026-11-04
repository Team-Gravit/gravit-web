import { keepPreviousData } from '@tanstack/react-query';

import { useGetSessionHistory } from '@/shared/api/generated/interview-feedback-api/interview-feedback-api';
import type { GetSessionHistorySort } from '@/shared/api/generated/model';

/**
 * 완료한 면접 세션 목록 한 페이지. 화면은 1부터 세는 페이지를 쓰고, API는 0부터 센다.
 * 페이지를 넘기는 동안 이전 목록을 유지해 목록 높이가 흔들리지 않게 한다.
 */
export function useInterviewSessionHistory(page: number, sort: GetSessionHistorySort) {
  return useGetSessionHistory(
    { page: page - 1, sort },
    { query: { placeholderData: keepPreviousData } },
  );
}
