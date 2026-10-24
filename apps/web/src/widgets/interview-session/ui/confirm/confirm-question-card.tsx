import { cn } from '@/shared/lib/cn';
import { Chip } from '@/shared/ui/chip';

interface ConfirmQuestionCardProps {
  order: number;
  question: string;
  /** 모바일은 더 좁은 패딩/타이포를 쓴다. */
  compact?: boolean;
}

/** 문제 N chip + 질문 본문. */
export function ConfirmQuestionCard({ order, question, compact }: ConfirmQuestionCardProps) {
  return (
    <div className={cn('flex flex-col rounded-12 bg-bg-0', compact ? 'gap-1 p-3' : 'gap-6 p-8')}>
      <div>
        <Chip variant="neutral">문제 {order}</Chip>
      </div>
      <p className={cn('text-text-1', compact ? 'text-body1-normal' : 'text-heading1 px-2')}>
        {question}
      </p>
    </div>
  );
}
