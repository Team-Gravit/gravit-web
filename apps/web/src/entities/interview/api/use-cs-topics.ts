import { useGetCsTopics } from '@/shared/api/generated/interview-topic-api/interview-topic-api';
import type { InterviewTopicResponse } from '@/shared/api/generated/model';

// OpenAPI 응답에 schema 가 없어 생성 타입이 unknown 이다. 백엔드가 schema 를 추가하면 단언을 제거한다.
function toTopics(response: unknown) {
  return response as InterviewTopicResponse[];
}

/** 공통 CS 모드에서 고를 수 있는 주제. 서버가 정한 노출 순서를 따른다. */
export function useCsTopics() {
  // 서버가 선언한 고정 목록이라 배포 전에는 바뀌지 않는다. 새로고침 또는 캐시 만료(gcTime) 때만 다시 받는다.
  return useGetCsTopics({ query: { select: toTopics, staleTime: Infinity } });
}
