/** 문의 유형 코드 → 사용자에게 보이는 라벨. 서버가 보내는 코드 기준이다. */
export const INQUIRY_TYPE_LABEL: Record<string, string> = {
  BUG_REPORT: '버그 신고',
  CONTENT_ERROR: '콘텐츠 오류',
  FEATURE_SUGGESTION: '기능 제안',
  OTHER: '기타',
};

/** 알 수 없는 유형 코드는 '기타'로 표기한다 (legacy 동작 보존). */
export function getInquiryTypeLabel(type: string): string {
  return INQUIRY_TYPE_LABEL[type] ?? '기타';
}

/** 문의 작성 드롭다운 옵션. `INQUIRY_TYPE_LABEL`의 정의 순서를 그대로 쓴다. */
export const INQUIRY_TYPE_OPTIONS = Object.entries(INQUIRY_TYPE_LABEL).map(([value, label]) => ({
  value,
  label,
}));
