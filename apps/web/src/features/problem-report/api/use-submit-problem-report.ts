import { useSubmitProblemReport as useSubmitProblemReportMutation } from '@/shared/api/generated/report-api/report-api';

import type { ReportType } from '../model/report-type';

interface UseSubmitProblemReportOptions {
  onSuccess: () => void;
  onError: () => void;
}

interface ProblemReportInput {
  problemId: number;
  reportType: ReportType;
  /** legacy와 같이 앞뒤 공백을 포함해 입력한 그대로 보낸다. */
  content: string;
}

/** 제출 결과에 따른 모달 전환과 실패 안내는 호출한 쪽이 처리한다. */
export function useSubmitProblemReport({ onSuccess, onError }: UseSubmitProblemReportOptions) {
  const mutation = useSubmitProblemReportMutation({
    mutation: { retry: false, onSuccess, onError },
  });

  const submitReport = (reportInput: ProblemReportInput) => mutation.mutate({ data: reportInput });

  return { submitReport, isSubmitting: mutation.isPending };
}
