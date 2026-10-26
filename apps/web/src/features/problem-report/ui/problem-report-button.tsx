import { useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { toast } from '@/shared/ui/toast';

import { useSubmitProblemReport } from '../api/use-submit-problem-report';
import { PROBLEM_REPORT_LABEL, REPORT_FAILURE_MESSAGE } from '../model/constants';
import { useReportForm } from '../model/use-report-form';
import { ProblemReportModal } from './problem-report-modal';
import { ProblemReportSuccessModal } from './problem-report-success-modal';

export interface ProblemReportButtonProps {
  /** 현재 화면에 보이는 문제의 ID. */
  problemId: number;
  className?: string;
}

export function ProblemReportButton({ problemId, className }: ProblemReportButtonProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { reportType, content, canSubmit, setReportType, setContent, resetForm } = useReportForm();
  const { submitReport, isSubmitting } = useSubmitProblemReport({
    // 성공 안내는 작성 모달을 대신한다. 작성 모달 위에 겹쳐 띄우지 않는다 (legacy와 같다).
    onSuccess: () => {
      setIsReportModalOpen(false);
      setIsSuccessModalOpen(true);
    },
    // 재시도할 수 있도록 작성 모달과 입력을 그대로 둔다.
    onError: () => toast(REPORT_FAILURE_MESSAGE, { position: 'noneTabBottom' }),
  });

  const handleReportModalOpen = () => {
    resetForm();
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = () => {
    if (!canSubmit || reportType === null) {
      return;
    }

    submitReport({ problemId, reportType, content });
  };

  return (
    <>
      {/* IconButton은 아이콘 크기가 하나뿐이고 색이 text-2로 고정돼, 시안의 24/32px · icon 색을 표현할 수 없다. */}
      <button
        data-slot="problem-report-button"
        type="button"
        onClick={handleReportModalOpen}
        aria-label={PROBLEM_REPORT_LABEL}
        className={cn(
          'shrink-0 cursor-pointer rounded-8 p-1 text-icon outline-none',
          'focus-visible:ring-3 focus-visible:ring-purple-200',
          className,
        )}
      >
        <Icon name="siren" className="size-6 md:size-8" />
      </button>
      <ProblemReportModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        reportType={reportType}
        onReportTypeChange={setReportType}
        content={content}
        onContentChange={setContent}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        onSubmit={handleReportSubmit}
      />
      <ProblemReportSuccessModal open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen} />
    </>
  );
}
