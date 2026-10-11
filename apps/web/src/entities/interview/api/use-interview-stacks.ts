import { useQueryClient } from '@tanstack/react-query';

import {
  getGetStacksQueryOptions,
  useGetStacks,
} from '@/shared/api/generated/interview-stack-group-api/interview-stack-group-api';
import type { InterviewStackResponse } from '@/shared/api/generated/model';

import type { InterviewStackGroup } from '../model/interview-options';

// OpenAPI 응답에 schema 가 없어 생성 타입이 unknown 이다. 백엔드가 schema 를 추가하면 단언을 제거한다.
function toStacks(response: unknown) {
  return response as InterviewStackResponse[];
}

// 고정 선택지라 화면을 오갈 때마다 다시 조회하지 않는다. 캐시가 제거되면 다음 진입에서 다시 받는다.
const STACKS_STALE_TIME = Infinity;

/** 직군 그룹에 속한 스택. 서버가 정한 노출 순서를 따른다. */
export function useInterviewStacks(stackGroup: InterviewStackGroup) {
  return useGetStacks(stackGroup, { query: { select: toStacks, staleTime: STACKS_STALE_TIME } });
}

/**
 * 직군 선택 시 다음 화면의 스택 목록을 미리 받아 둔다. 남아 있는 캐시는 재사용한다.
 * 실패는 선택을 막지 않는다. 스택 화면에서 조회 결과와 재시도를 처리한다.
 */
export function usePrefetchInterviewStacks() {
  const queryClient = useQueryClient();

  return (stackGroup: InterviewStackGroup) => {
    void queryClient.prefetchQuery(
      getGetStacksQueryOptions(stackGroup, { query: { staleTime: STACKS_STALE_TIME } }),
    );
  };
}
