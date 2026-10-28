import type { FormEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { CheckIcon, CloseMdIcon, Icon, ShapeSquareIcon } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { Modal, ModalTitle } from '@/shared/ui/modal';
import { FloatingTextArea } from '@/shared/ui/text-field';

import { REPORT_TYPE_OPTIONS, type ReportType } from '../model/report-type';

const REPORT_REASON_LABEL = '신고 사유';

export interface ProblemReportModalProps {
  open: boolean;
  /** 닫기, 그만두기, Esc, 바깥 클릭에서 false를 전달한다. */
  onOpenChange: (open: boolean) => void;
  reportType: ReportType | null;
  onReportTypeChange: (reportType: ReportType) => void;
  content: string;
  onContentChange: (content: string) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function ProblemReportModal({
  open,
  onOpenChange,
  reportType,
  onReportTypeChange,
  content,
  onContentChange,
  canSubmit,
  isSubmitting,
  onSubmit,
}: ProblemReportModalProps) {
  const handleReportSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-8 bg-bg-1 p-0 shadow-elevation-1 md:max-w-[630px] md:rounded-12"
    >
      <div className="flex items-center justify-between border-b border-divider-1 px-4 py-2 md:px-6 md:py-3">
        <ModalTitle className="text-body2-normal text-text-4 md:text-body1-normal">
          신고하기
        </ModalTitle>
        <IconButton icon={CloseMdIcon} aria-label="닫기" onClick={() => onOpenChange(false)} />
      </div>

      <form onSubmit={handleReportSubmit} className="flex flex-col gap-3 p-4 md:gap-6 md:p-8">
        <div className="flex flex-col gap-3 md:gap-6">
          {/* 하나만 고르므로 의미는 라디오다. 모양만 시안의 체크박스를 따른다. */}
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">신고 유형</legend>
            {REPORT_TYPE_OPTIONS.map((option) => (
              <ReportTypeOption
                key={option.reportType}
                label={option.label}
                isSelected={option.reportType === reportType}
                onSelect={() => onReportTypeChange(option.reportType)}
              />
            ))}
          </fieldset>
          {/* FloatingTextArea의 데스크톱 기본 높이는 400px이다. 신고 폼은 시안의 최소 130px을 쓴다. */}
          <FloatingTextArea
            label={REPORT_REASON_LABEL}
            aria-label={REPORT_REASON_LABEL}
            placeholder="신고 사유를 입력해주세요."
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            className="md:h-auto md:min-h-[130px]"
          />
        </div>

        <div className="flex gap-3 md:gap-4">
          <Button
            type="button"
            variant="stroke-neutral"
            size="cta"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            그만두기
          </Button>
          <Button
            type="submit"
            size="cta"
            className="flex-1"
            disabled={!canSubmit}
            isLoading={isSubmitting}
          >
            제출하기
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface ReportTypeOptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

function ReportTypeOption({ label, isSelected, onSelect }: ReportTypeOptionProps) {
  return (
    <label
      className={cn(
        'flex h-12 cursor-pointer items-center gap-3 rounded-8 border border-divider-1 bg-bg-0 px-3',
        // 웹 시안은 테두리 대신 그림자를 쓴다. 해당 토큰이 없어 Card와 같은 값을 쓴다.
        'md:h-[74px] md:gap-4 md:border-transparent md:px-4 md:shadow-[0px_4px_32px_0px_#00000006]',
        'has-focus-visible:ring-3 has-focus-visible:ring-purple-200',
      )}
    >
      <input
        type="radio"
        name="report-type"
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      <span aria-hidden className="relative size-6 shrink-0">
        <Icon
          icon={ShapeSquareIcon}
          className={cn('absolute inset-0', isSelected ? 'fill-cta text-cta' : 'text-icon')}
        />
        {isSelected && <Icon icon={CheckIcon} className="absolute inset-0 text-purple-50" />}
      </span>
      <span className="text-body1-normal text-text-2 md:text-heading2">{label}</span>
    </label>
  );
}
