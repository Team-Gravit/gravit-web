import { useState } from 'react';

import type { ReportType } from './report-type';

// 사유 없는 신고는 운영자가 수정 대상을 알 수 없어 제출을 막는다 (MIG-068 판정).
export function useReportForm() {
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [content, setContent] = useState('');

  const canSubmit = reportType !== null && content.trim().length > 0;

  const resetForm = () => {
    setReportType(null);
    setContent('');
  };

  return { reportType, content, canSubmit, setReportType, setContent, resetForm };
}
