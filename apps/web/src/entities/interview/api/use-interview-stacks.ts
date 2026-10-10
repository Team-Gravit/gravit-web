import { useGetStacks } from '@/shared/api/generated/interview-stack-group-api/interview-stack-group-api';
import type { InterviewStackResponse } from '@/shared/api/generated/model';

import type { InterviewStackGroup } from '../model/interview-options';

// OpenAPI 응답에 schema 가 없어 생성 타입이 unknown 이다. 백엔드가 schema 를 추가하면 단언을 제거한다.
function toStacks(response: unknown) {
  return response as InterviewStackResponse[];
}

/** 직군 그룹에 속한 스택. 서버가 정한 노출 순서를 따른다. */
export function useInterviewStacks(stackGroup: InterviewStackGroup) {
  // 서버가 선언한 고정 목록이라 배포 전에는 바뀌지 않는다. 새로고침 또는 캐시 만료(gcTime) 때만 다시 받는다.
  return useGetStacks(stackGroup, { query: { select: toStacks, staleTime: Infinity } });
}
