// 생성 API를 도메인 경계에서 다시 노출해 호출부가 생성 경로에 직접 결합하지 않게 한다.
// 변환·옵션이 없으므로 이름만 도메인 어휘로 바꿔 선택적으로 re-export 한다.
export {
  useGetNoticeSummaries as useNotices,
  getGetNoticeSummariesQueryKey as getNoticesQueryKey,
  // 이름은 Summary지만 단건 조회는 상세(NoticeDetailResponse)를 돌려준다.
  useGetNoticeSummary as useNoticeDetail,
  getGetNoticeSummaryQueryKey as getNoticeDetailQueryKey,
} from '@/shared/api/generated/notice-query-api/notice-query-api';

export type { NoticeSummaryResponse } from '@/shared/api/generated/model/noticeSummaryResponse';
export type { NoticeSummaryPageResponse } from '@/shared/api/generated/model/noticeSummaryPageResponse';
export type { NoticeDetailResponse } from '@/shared/api/generated/model/noticeDetailResponse';
