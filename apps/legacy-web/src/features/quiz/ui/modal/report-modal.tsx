import { type FormEvent, useState } from 'react';

import { useSubmitProblemReport } from '@/shared/api/@generated/report-api/report-api';
import { Button } from '@/shared/ui/button/Button';
import CheckBox from '@/shared/ui/checkbox/checkbox';
import TextArea from '@/shared/ui/input/textarea';
import Modal from '@/shared/ui/modal/compound-modal';

import { useLessonModal, useLessonModalStore } from '../../model/use-lesson-modal-store';

export interface ReportModalRef {
  open: () => void;
  close: () => void;
}

export type ReportType = 'TYPO_ERROR' | 'CONTENT_ERROR' | 'ANSWER_ERROR' | 'OTHER_ERROR';

const OPTIONS = [
  { reportType: 'TYPO_ERROR', text: '문제/선지에 오탈자가 있습니다.' },
  { reportType: 'CONTENT_ERROR', text: '문제 자체에 오류가 있습니다.' },
  { reportType: 'ANSWER_ERROR', text: '답안에 오류가 있습니다.' },
  { reportType: 'OTHER_ERROR', text: '기타' },
] as const;

interface ReportFormData {
  reportType: ReportType | null;
  content: string;
}

const initialReportState: ReportFormData = {
  reportType: null,
  content: '',
};

interface ReportModalProps {
  problemId: number;
}

export default function ReportModal({ problemId }: ReportModalProps) {
  const reportModal = useLessonModal('report');
  const openLessonModal = useLessonModalStore((state) => state.openLessonModal);

  const [formData, setFormData] = useState<ReportFormData>(initialReportState);

  const { mutate: onSubmit } = useSubmitProblemReport({
    mutation: {
      onSuccess: () => {
        openLessonModal('result');
        setFormData(initialReportState);
      },
    },
  });

  const handleSelectReportOption = (reportType: ReportType) => {
    setFormData((prev) => ({ ...prev, reportType }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { reportType, content } = formData;
    if (reportType) {
      onSubmit({
        data: {
          problemId,
          reportType,
          content,
        },
      });
    }
  };

  const isValid = formData.reportType && formData.content.trim().length > 0;

  return (
    <Modal isOpen={reportModal.isOpen} onClose={reportModal.closeModal}>
      <Modal.Header title="신고하기" />
      <Modal.Content>
        <form id="problem-report-form" className="space-y-3" onSubmit={handleSubmit}>
          <ul className="w-full flex flex-col gap-3">
            {OPTIONS.map((option) => {
              const isSelected = option.reportType === formData.reportType;
              return (
                <li
                  key={option.reportType}
                  onClick={() => handleSelectReportOption(option.reportType)}
                >
                  <label className="w-full flex gap-4 items-center cursor-pointer p-[15px] bg-white border border-divider-1 rounded-lg">
                    <CheckBox
                      checked={isSelected}
                      value={option.reportType}
                      onCheckedChange={() => handleSelectReportOption(option.reportType)}
                    />

                    <span className="text-body1-normal text-text-2">{option.text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <TextArea
            id="report-summary"
            label="신고내용"
            value={formData.content}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, content: e.target.value }));
            }}
            labelClassName="mb-1"
            textareaClassName="text-body2-reading"
            placeholder="신고내용을 입력해주세요."
            className="h-[130px]"
          />
        </form>
      </Modal.Content>
      <Modal.Footer className="flex items-center gap-3 p-4 pt-0">
        <Button
          type="button"
          size="custom"
          onClick={reportModal.closeModal}
          variant={'strokeGray'}
          className="w-full h-12 text-main-1 bg-white text-headline2"
        >
          그만두기
        </Button>
        <Button
          type="submit"
          size="custom"
          form="problem-report-form"
          className="h-12 w-full text-headline2"
          disabled={!isValid}
        >
          제출하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
