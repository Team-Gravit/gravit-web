export { useMyInquiries } from './api/use-my-inquiries';
export { useInquiryDetail } from './api/use-inquiry-detail';
export { getInquiryTypeLabel, INQUIRY_TYPE_LABEL, INQUIRY_TYPE_OPTIONS } from './model/inquiry-type';
export { INQUIRY_STATUS_LABEL, isResolved, type InquiryStatus } from './model/inquiry-status';
export { InquiryTypeChip } from './ui/inquiry-type-chip';
export { InquiryStatusChip } from './ui/inquiry-status-chip';

// 생성 타입을 도메인 경계에서 노출한다. 화면은 generated 경로를 직접 참조하지 않는다.
export type { InquirySummaryResponse, InquiryDetailResponse } from '@/shared/api/generated/model';
