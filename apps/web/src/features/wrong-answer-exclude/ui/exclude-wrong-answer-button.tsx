import { Button, type ButtonProps } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useExcludeWrongAnswer } from '../api/use-exclude-wrong-answer';
import { WRONG_ANSWER_EXCLUDE_LABEL } from '../model/constants';

export interface ExcludeWrongAnswerButtonProps {
  problemId: number;
  /** 제외에 성공하면 호출한다. 버튼을 숨기는 것은 호출자가 정한다. */
  onExcluded: (problemId: number) => void;
  size?: ButtonProps['size'];
  className?: string;
}

/** 맞힌 오답 문제를 오답노트에서 내린다 (시안 QUIZ-08/A). */
export function ExcludeWrongAnswerButton({
  problemId,
  onExcluded,
  size,
  className,
}: ExcludeWrongAnswerButtonProps) {
  const { excludeWrongAnswer, isPending } = useExcludeWrongAnswer({ onExcluded });

  return (
    <Button
      type="button"
      variant="stroke-error"
      size={size}
      className={className}
      startIcon={<Icon name="learning-fill" size={16} />}
      isLoading={isPending}
      onClick={() => excludeWrongAnswer(problemId)}
    >
      {WRONG_ANSWER_EXCLUDE_LABEL}
    </Button>
  );
}
