export type InquiryStatus = 'PENDING' | 'RESOLVED';

export const INQUIRY_STATUS_LABEL = {
  PENDING: '답변 대기',
  RESOLVED: '답변 완료',
} as const satisfies Record<InquiryStatus, string>;

/** 답변이 달린 상태인지. 서버 status 문자열을 그대로 받는다. */
export function isResolved(status: string): boolean {
  return status === 'RESOLVED';
}
