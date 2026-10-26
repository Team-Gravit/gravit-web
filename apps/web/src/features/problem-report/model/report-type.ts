// OpenAPI의 reportType은 string이라 허용값을 이 목록에서 관리한다.
export const REPORT_TYPE_OPTIONS = [
  { reportType: 'TYPO_ERROR', label: '문제/선지에 오탈자가 있습니다.' },
  { reportType: 'CONTENT_ERROR', label: '문제 자체에 오류가 있습니다.' },
  { reportType: 'ANSWER_ERROR', label: '답안에 오류가 있습니다.' },
  { reportType: 'OTHER_ERROR', label: '기타' },
] as const;

export type ReportType = (typeof REPORT_TYPE_OPTIONS)[number]['reportType'];
