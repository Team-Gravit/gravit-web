import { useInterviewSessionStore } from '@/entities/interview-session';
import { cn } from '@/shared/lib/cn';
import { Chip } from '@/shared/ui/chip';

const FAILED_PLACEHOLDER = '음성 변환에 실패했어요. 답변을 직접 입력해주세요';

interface ConfirmAnswerFieldProps {
  order: number;
  status?: string;
  className?: string;
}

/** 답변 편집 textarea. store.answers[order].content 에 바인딩한다(수화본/직접입력 공통). */
export function ConfirmAnswerField({ order, status, className }: ConfirmAnswerFieldProps) {
  const content = useInterviewSessionStore((s) => s.answers[order]?.content ?? '');
  const setAnswerContent = useInterviewSessionStore((s) => s.setAnswerContent);

  return (
    <textarea
      value={content}
      onChange={(event) => setAnswerContent(order, event.target.value)}
      placeholder={
        status === 'FAILED' ? FAILED_PLACEHOLDER : '저장된 답변이 없어요 답변을 직접 입력해주세요'
      }
      className={cn(
        'text-body2-normal md:text-heading1 w-full resize-none bg-transparent text-text-1 flex-1',
        'outline-none placeholder:text-text-4',
        className,
      )}
    />
  );
}

/** 답변 N chip. */
export function ConfirmAnswerChip({ order }: { order: number }) {
  return (
    <Chip variant="outlined" className="border-bg-1 md:border-divider-1">
      답변 {order}
    </Chip>
  );
}
